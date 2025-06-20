import { Button } from '@/components/ui/button'
import { memo, useCallback, useMemo, useState } from 'react'

const initialItems = new Array(40_987_964).fill(0).map((_, index) => {
  return {
    id: index,
    isSelected: index === 40_987_963
  }
})

export default function RenderTest() {
  const [count, setCount] = useState(10)

  console.log('Rendered RenderTest')

  // useCallback is used to memoize the function
  const handleClick = useCallback(() => {
    setCount((prev) => prev + 1)
  }, [])

  // Functions are recreated on every render
  // const handleClick = () => {
  //   setCount((prev) => prev + 1)
  // }

  // const newItems = initialItems.find(item => item.isSelected)
  const newItems = useMemo(() => initialItems.find((item) => item.isSelected), [])

  return (
    <div>
      <h1>Selected Item: {newItems?.id}</h1>
      <h1>Count: {count}</h1>
      <ButtonContainer onClick={handleClick} />
    </div>
  )
}

const ButtonContainer = memo(({ onClick }: { onClick: () => void }) => {
  console.log('Rendered ButtonContainer')

  return (
    <div>
      <Button onClick={onClick}>Click me</Button>
    </div>
  )
})
