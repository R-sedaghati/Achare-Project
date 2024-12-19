<template>
  <header>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid p-0 px-md-5">
        <div class="row w-100">
          <ul class="navbar-nav flex-row col-10 col-md-11 pe-4 pt-2">
            <li class="nav-item">
              <router-link
                class="nav-link fw-bold fs-5"
                aria-current="page"
                to="/"
              >
                مشاهده‌آدرس‌ها
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link fw-bold fs-5 me-3"
                aria-current="page"
                to="/register"
              >
                ثبت‌آدرس
              </router-link>
            </li>
          </ul>
          <img
            src="../assets/achareh-logo_BSeNfAD.png"
            class="col-2 col-md-1 p-0"
            height="75"
          />
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: "AppHeader",
};
</script>

<style scoped>
/* Apply the custom active link color */
.router-link-active {
  color: #00bfa6 !important;
}
</style>
