Write-Host "Starting ngrok tunnel..." -ForegroundColor Cyan

Start-Process -NoNewWindow -FilePath "npx" -ArgumentList "ngrok http 3000"
Start-Sleep -Seconds 6

$tunnels = Invoke-RestMethod "http://localhost:4040/api/tunnels"
$url = $tunnels.tunnels[0].public_url

Write-Host "Tunnel URL: $url" -ForegroundColor Green

$BOT_TOKEN = "8028355011:AAGgyLL2kfAYIY98O6tPQtg_4aSoyASKzwo"
$result = Invoke-RestMethod -Uri "https://api.telegram.org/bot$BOT_TOKEN/setWebhook?url=$url/api/telegram/webhook"

if ($result.ok) {
    Write-Host "Telegram webhook registered: $url/api/telegram/webhook" -ForegroundColor Green
} else {
    Write-Host "Webhook error: $($result.description)" -ForegroundColor Red
}
