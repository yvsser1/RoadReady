import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Star } from 'lucide-react'

interface Review {
  id: number
  user_id: string
  car_id: number
  rating: number
  comment: string
  created_at: string
  user: {
    full_name: string
  }
}

interface ReviewsProps {
  carId: number
}

export default function Reviews({ carId }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' })
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetchReviews()
    fetchUser()
  }, [carId])

  async function fetchReviews() {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, user:users(full_name)')
      .eq('car_id', carId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching reviews:', error)
    } else {
      setReviews(data || [])
    }
  }

  async function fetchUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  async function submitReview() {
    if (!user) {
      alert('Please log in to submit a review')
      return
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert([
        {
          user_id: user.id,
          car_id: carId,
          rating: newReview.rating,
          comment: newReview.comment
        }
      ])

    if (error) {
      console.error('Error submitting review:', error)
    } else {
      fetchReviews()
      setNewReview({ rating: 0, comment: '' })
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>
      {reviews.map((review) => (
        <div key={review.id} className="mb-4 p-4 bg-secondary rounded-lg">
          <div className="flex items-center mb-2">
            <div className="flex mr-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="font-bold">{review.user.full_name}</span>
          </div>
          <p>{review.comment}</p>
        </div>
      ))}
      {user && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Write a Review</h3>
          <div className="flex mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-8 h-8 cursor-pointer ${star <= newReview.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                onClick={() => setNewReview({ ...newReview, rating: star })}
              />
            ))}
          </div>
          <Textarea
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            placeholder="Write your review here..."
            className="mb-2"
          />
          <Button onClick={submitReview}>Submit Review</Button>
        </div>
      )}
    </div>
  )
}

