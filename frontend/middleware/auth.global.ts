/** 公開的頁面 (不需登入即可訪問的頁面) */
const PUBLIC_PAGE = ["/login", "/signup"]

// TODO: 這裡要換後端的 API，目前先暫時用這個
const BASE_URL = "https://jsonplaceholder.typicode.com/posts/1"

export default defineNuxtRouteMiddleware(async (to) => {
  if (process.client || PUBLIC_PAGE.includes(to.path)) return

  try {
    const token = useCookie("token")
    const { data } = await useAsyncData("user", () =>
      $fetch(BASE_URL, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })
    )

    // 頁面可以透過以下方式獲取使用者資訊
    const nuxtApp = useNuxtApp()
    console.log(nuxtApp.payload.data.user)
    // 頁面可以透過以上方式獲取使用者資訊

    if (data.value) return
  } catch (err) {
    console.error(err)
  }

  const route: Parameters<typeof navigateTo>[0] = { name: "login" }

  if (to.name && to.name !== "index") {
    route.query = { redirect: to.path }
  }

  return navigateTo(route)
})
