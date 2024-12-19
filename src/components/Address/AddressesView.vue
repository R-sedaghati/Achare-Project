<template>
  <div
    v-if="loading"
    dir="rtl"
    class="container-fluid bg-body-secondary"
    style="height: 90vh"
  >
    <div
      v-if="loading"
      class="d-flex justify-content-center align-items-center h-100"
    >
      <div class="spinner-border"></div>
    </div>
  </div>
  <div v-else dir="rtl" class="container-fluid bg-body-secondary">
    <div>
      <p class="fs-2 ps-4 pt-3 pt-md-5 text-center">آدرس ها و مشخصات</p>
      <div
        v-for="(address, index) in address"
        :key="index"
        class="container bg-white hy-auto mt-4 mx-md-auto"
      >
        <div class="row p-4 mx-auto">
          <div
            class="col-12 col-md-6 col-lg-4 d-flex flex-row justify-content-between d-md-block"
          >
            <p class="color-sec fs-5">نام</p>
            <p class="fs-5">{{ address.first_name }}</p>
          </div>
          <div
            class="col-12 col-md-6 col-lg-4 d-flex flex-row justify-content-between d-md-block"
          >
            <p class="color-sec fs-5">نام خانوادگی</p>
            <p class="fs-5">{{ address.last_name }}</p>
          </div>
          <div
            class="col-12 col-md-6 col-lg-4 d-flex flex-row justify-content-between d-md-block"
          >
            <p class="color-sec fs-5">شماره تلفن همراه</p>
            <p class="fs-5">{{ address.coordinate_mobile }}</p>
          </div>
          <div
            class="col-12 col-md-6 col-lg-4 d-flex flex-row justify-content-between d-md-block"
          >
            <p class="color-sec fs-5">شماره تلفن ثابت</p>
            <p class="fs-5">{{ address.coordinate_phone_number || "ندارد" }}</p>
          </div>
          <div
            class="col-12 col-md-6 col-lg-4 d-flex flex-row justify-content-between d-md-block"
          >
            <p class="color-sec fs-5">جنسیت</p>
            <p class="fs-5">{{ address.gender === "male" ? "آقا" : "خانم" }}</p>
          </div>
          <div class="col-12 col-md-6 col-lg-4">
            <p class="color-sec fs-5">آدرس</p>
            <p class="fs-5">{{ address.address }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const address = ref(null);
const loading = ref(true);
const error = ref("");

const fetchAddress = async () => {
  try {
    const response = await fetch(
      "https://stage.achareh.ir/api/karfarmas/address",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic MDk4MjIyMjIyMjI6U2FuYTEyMzQ1Njc4",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    address.value = data; // Assuming the API response is a single address object
  } catch (err) {
    error.value = err.message || "خطا در دریافت اطلاعات";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAddress();
});
</script>

<style scoped>
.color-sec {
  color: #ced4da;
}
</style>
