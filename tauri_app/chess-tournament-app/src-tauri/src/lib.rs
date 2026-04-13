use serde_json::{json, Value};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      search_lichess,
      lookup_chesscom
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

/// Search Lichess for players by term (username or real name)
#[tauri::command]
async fn search_lichess(term: String) -> Result<Value, String> {
  if term.is_empty() || term.len() < 2 {
    return Err("Search term must be at least 2 characters".to_string());
  }

  let client = reqwest::Client::new();
  let url = format!("https://lichess.org/api/player/autocomplete?term={}", 
    urlencoding::encode(&term));

  match client
    .get(&url)
    .header("Accept", "application/json")
    .timeout(std::time::Duration::from_secs(10))
    .send()
    .await
  {
    Ok(response) => {
      match response.json::<Value>().await {
        Ok(data) => Ok(data),
        Err(e) => Err(format!("Failed to parse Lichess response: {}", e)),
      }
    }
    Err(e) => Err(format!("Lichess API error: {}", e)),
  }
}

/// Lookup Chess.com player profile and ratings
#[tauri::command]
async fn lookup_chesscom(username: String) -> Result<Value, String> {
  if username.is_empty() {
    return Err("Username cannot be empty".to_string());
  }

  let client = reqwest::Client::new();
  let username_lower = username.to_lowercase();

  // Fetch player profile
  let profile_url = format!("https://api.chess.com/pub/player/{}", username_lower);
  
  let profile_response = match client
    .get(&profile_url)
    .header("User-Agent", "ChessTournamentManager/1.0")
    .timeout(std::time::Duration::from_secs(10))
    .send()
    .await
  {
    Ok(resp) => resp,
    Err(e) => return Err(format!("Failed to fetch Chess.com profile: {}", e)),
  };

  if profile_response.status() == 404 {
    return Err("Player not found on Chess.com".to_string());
  }

  let profile: Value = match profile_response.json().await {
    Ok(data) => data,
    Err(e) => return Err(format!("Failed to parse Chess.com profile: {}", e)),
  };

  // Fetch player stats
  let stats_url = format!("https://api.chess.com/pub/player/{}/stats", username_lower);
  
  let stats: Value = match client
    .get(&stats_url)
    .header("User-Agent", "ChessTournamentManager/1.0")
    .timeout(std::time::Duration::from_secs(10))
    .send()
    .await
  {
    Ok(resp) => match resp.json().await {
      Ok(data) => data,
      Err(_) => json!({}),
    },
    Err(_) => json!({}),
  };

  // Combine profile and stats
  let result = json!({
    "profile": profile,
    "stats": stats
  });

  Ok(result)
}
