import { Star } from 'lucide-react'
import { Button } from "./button"

interface RatingProps {
  value: number
  onChange: (value: number) => void
  max?: number
}

export function Rating({ value, onChange, max = 5 }: RatingProps) {
  return (
    <div className="flex space-x-1">
      {Array.from({ length: max }).map((_, index) => (
        <Button
          key={index}
          variant="ghost"
          size="sm"
          onClick={() => onChange(index + 1)}
        >
          <Star
            className={`h-4 w-4 ${
              index < value ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        </Button>
      ))}
    </div>
  )
}

