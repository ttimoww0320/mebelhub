import BroadcastForm from './broadcast-form'

export default function AdminBroadcastPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Рассылка</h1>
      <p className="text-sm text-gray-400 mb-8">Отправить уведомление пользователям</p>
      <BroadcastForm />
    </div>
  )
}
