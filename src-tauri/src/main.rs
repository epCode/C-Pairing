// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
async fn proxy_request(url: String, method: String, body: String) -> Result<String, String> {
    let client = reqwest::Client::builder()
        .user_agent("ChessTournamentManager/1.0 (Tauri)")
        .build()
        .map_err(|e| e.to_string())?;

    let req = if method.to_uppercase() == "POST" {
        client.post(&url).header("Content-Type", "text/plain").body(body)
    } else {
        client.get(&url)
    };

    let res = req.header("Accept", "application/json")
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if res.status().is_success() {
        res.text().await.map_err(|e| e.to_string())
    } else {
        Err(format!("HTTP Error: {}", res.status()))
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![proxy_request])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
