import { useEffect } from "react"

export const Home = () => {
  useEffect(() => {
    document.title = "Home";
  }, [])
  return (
    <>
      Hola desde home
    </>
  )
}
