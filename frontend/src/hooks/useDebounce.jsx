import {useState} from "react"

export const useDebounce = (asyncCallback, onSuccess) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (...args) => {
    if (isSubmitting) return

    setIsSubmitting(true)
    setError(null)
    try {
      await asyncCallback(...args)
      if (onSuccess) onSuccess()
    } catch (err) {
      setError(err)
      console.error("Submission failed:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {handleSubmit, isSubmitting, error}
}

