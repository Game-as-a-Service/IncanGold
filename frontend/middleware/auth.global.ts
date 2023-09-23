const PUBLIC_PAGE = ["/login", "/signup"]

export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie("token")
  const pagePath = to.path

  if (token.value || PUBLIC_PAGE.includes(pagePath)) return

  const route: Parameters<typeof navigateTo>[0] = { name: "login" }

  if (to.name && to.name !== "index") {
    route.query = { redirect: to.path }
  }

  return navigateTo(route)
})
