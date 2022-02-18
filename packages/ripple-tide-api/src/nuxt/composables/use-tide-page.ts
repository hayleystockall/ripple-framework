declare const useRoute: any
declare const useFetch: any

export const useTidePage = async () => {
  const route = useRoute()
  const { data } = await useFetch(
    `http://localhost:3000/api/tide/page?path=${route.path}`
  )
  return data
}
