export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase/admin'
import DeleteReviewButton from './delete-button'

export default async function AdminReviewsPage() {
  const admin = createAdminClient()

  const { data: reviews } = await admin
    .from('reviews')
    .select('id, rating, comment, created_at, customer:profiles!customer_id(full_name), craftsman:profiles!craftsman_id(full_name)')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Отзывы</h1>
      <p className="text-sm text-gray-400 mb-8">{reviews?.length ?? 0} отзывов</p>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {!reviews?.length && (
          <div className="text-center py-16 text-gray-400 text-sm">Отзывов нет</div>
        )}
        {reviews?.map((review, i) => (
          <div key={review.id} className={`px-5 py-4 flex items-start gap-4 ${i !== 0 ? 'border-t border-gray-50' : ''}`}>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-sm font-medium text-gray-900">
                  {(review.customer as any)?.full_name ?? '—'}
                </span>
                <span className="text-gray-300 text-xs">→</span>
                <span className="text-sm text-gray-600">
                  {(review.craftsman as any)?.full_name ?? '—'}
                </span>
                <span className="text-yellow-500 text-sm">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
              </div>
              {review.comment && (
                <div className="text-sm text-gray-600 mt-1">{review.comment}</div>
              )}
              <div className="text-xs text-gray-400 mt-1.5">
                {new Date(review.created_at).toLocaleDateString('ru-RU')}
              </div>
            </div>
            <DeleteReviewButton reviewId={review.id} />
          </div>
        ))}
      </div>
    </div>
  )
}
