<template>
  <template v-if="!showNotif">
    <div
      dir="rtl"
      class="container-fluid bg-body-secondary"
      style="height: 730px"
    >
      <template v-if="!showMap">
        <p class="fs-2 ps-4 pt-3 pt-md-5 text-center">ثبت‌آدرس</p>
        <div class="container bg-white hy-auto mt-4 mt-md-5">
          <p class="fw-semibold pt-3 pt-md-5 text-center">
            لطفا مشخصات و آدرس خود را وارد کنید
          </p>
          <form
            @submit.prevent="handleSubmit"
            class="row g-4 g-lg-5 mx-md-5 mb-md-5 mt-md-3"
          >
            <div class="col-12 col-md-4">
              <label for="first_name" class="form-label">نام</label>
              <input
                type="text"
                v-model="form.first_name"
                class="form-control custom-focus p-md-3"
                id="first_name"
                placeholder="مثال: رضا"
              />
              <span class="text-danger" v-if="errors.first_name">{{
                errors.first_name
              }}</span>
            </div>
            <div class="col-12 col-md-4">
              <label for="last_name" class="form-label">نام خوانوادگی</label>
              <input
                type="text"
                v-model="form.last_name"
                class="form-control custom-focus p-md-3"
                id="last_name"
                placeholder="مثال: رضایی"
              />
              <span class="text-danger" v-if="errors.last_name">{{
                errors.last_name
              }}</span>
            </div>
            <div class="col-12 col-md-4">
              <label for="coordinate_mobile" class="form-label"
                >شماره تلفن همراه</label
              >
              <input
                type="text"
                v-model="form.coordinate_mobile"
                class="form-control custom-focus p-md-3"
                id="coordinate_mobile"
                placeholder="مثال: 09121234567"
              />
              <span class="text-danger" v-if="errors.coordinate_mobile">{{
                errors.coordinate_mobile
              }}</span>
            </div>
            <div class="col-12 col-md-5">
              <label for="coordinate_phone_number" class="form-label"
                >شماره تلفن ثابت(اختیاری)</label
              >
              <input
                type="text"
                v-model="form.coordinate_phone_number"
                class="form-control custom-focus p-md-3"
                id="coordinate_phone_number"
                placeholder="مثال: 0211234567"
              />
              <span class="text-danger" v-if="errors.coordinate_phone_number">{{
                errors.coordinate_phone_number
              }}</span>
            </div>
            <div class="col-12 col-md-7">
              <label for="address" class="form-label">آدرس</label>
              <textarea
                type="text"
                v-model="form.address"
                class="form-control custom-focus p-md-3"
                id="address"
                rows="1"
                placeholder=""
              ></textarea>
              <span class="text-danger" v-if="errors.address">{{
                errors.address
              }}</span>
            </div>
            <div class="col-12 d-flex mb-4">
              <p class="me-5">جنسیت</p>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  v-model="form.gender"
                  value="female"
                  name="flexRadioDefault"
                  id="female"
                />
                <label class="form-check-label me-5" for="female"> خانم </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  v-model="form.gender"
                  value="male"
                  name="flexRadioDefault"
                  id="male"
                  checked
                />
                <label class="form-check-label" for="male"> آقا </label>
              </div>
            </div>
          </form>
        </div>
      </template>
      <template v-if="showMap">
        <p class="fs-2 ps-4 pt-3 pt-md-5 text-center">انتخاب آدرس</p>
        <div class="container bg-white hy-auto mt-3 mt-md-2 p-0">
          <div>
            <h5 class="text-center py-4">لطفاً موقعیت خود را انتخاب کنید:</h5>
            <div id="map" style="height: 450px; width: 100%"></div>
          </div>
        </div>
      </template>
    </div>
    <div v-if="!showMap">
      <div class="col-12 d-grid pt-4 w-50 mx-auto mx-md-auto">
        <button
          @click="handleSubmit"
          class="btn text-white p-2"
          style="background-color: #00bfa6"
        >
          ثبت و ادامه
          <div
            v-if="loading"
            class="spinner-border spinner-border-sm ms-2"
          ></div>
        </button>
      </div>
    </div>
    <div v-if="showMap">
      <div class="col-12 d-grid pt-4 w-50 mx-auto mx-md-auto">
        <button
          @click="handleSubmitToAPI"
          class="btn text-white p-2"
          style="background-color: #00bfa6"
        >
          <span v-if="!loading">ثبت و ادامه</span>
          <div
            v-if="loading"
            class="spinner-border spinner-border-sm ms-2"
          ></div>
        </button>
      </div>
    </div>
  </template>
  <div
    dir="rtl"
    v-if="showNotif"
    class="container-fluid bg-body-secondary d-flex justify-content-center align-items-center h"
    style="height: 80vh"
  >
    <div class="container mx-auto">
      <p class="text-center fw-bold fs-5">اطلاعات شما با موفقیت ثبت شد</p>
      <div class="d-grid gap-2">
        <button
          class="btn btn-white w-50 mx-auto p-md-3"
          style="color: #00bfa6; border: 4px solid #00bfa6"
          type="button"
        >
          <router-link
            to="/"
            class="fw-bold fs-5 text-decoration-none"
            style="color: #00bfa6"
            >مشاهده اطلاعات</router-link
          >
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, nextTick, onMounted } from "vue";
import L from "leaflet";

// Form data and state variables
const form = reactive({
  first_name: "",
  last_name: "",
  coordinate_mobile: "",
  coordinate_phone_number: "",
  address: "",
  gender: "male",
  region: "1",
});

const errors = reactive({});
const loading = ref(false);
const showMap = ref(false);
const showNotif = ref(false);
const selectedLocation = ref("No location selected");
let mapInstance = null;

// Form validation function
const validate = () => {
  errors.first_name =
    form.first_name.length < 3 ? "نام باید حداقل ۳ حرف باشد" : "";
  errors.last_name =
    form.last_name.length < 3 ? "نام خانوادگی باید حداقل ۳ حرف باشد" : "";
  errors.coordinate_mobile =
    !/^(\+98|0)?9\d{9}$/.test(form.coordinate_mobile) ||
    form.coordinate_mobile.length !== 11
      ? "شماره تلفن همراه باید ۱۱ رقم باشد و با ۰۹ شروع شود"
      : "";
  errors.coordinate_phone_number =
    form.coordinate_phone_number &&
    (!/^0\d{10}$/.test(form.coordinate_phone_number) ||
      form.coordinate_phone_number.length !== 11)
      ? "شماره تلفن ثابت باید ۱۱ رقم باشد و با ۰ شروع شود"
      : "";
  errors.address =
    form.address.length < 10 ? "آدرس باید حداقل ۱۰ حرف باشد" : "";
};

// Handle address form submission and switch to map
const handleSubmit = async () => {
  validate();

  if (Object.values(errors).some((error) => error)) {
    return;
  }

  showMap.value = true;

  await nextTick();
  initializeMap();
};

// Initialize map with Leaflet
const initializeMap = () => {
  if (mapInstance) return;

  L.Marker.prototype.options.icon = L.icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

  mapInstance = L.map("map").setView([35.6997, 51.338], 18);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(mapInstance);

  mapInstance.on("click", (e) => {
    const { lat, lng } = e.latlng;
    selectedLocation.value = { lat: lat.toFixed(6), lng: lng.toFixed(6) };

    if (mapInstance.marker) {
      mapInstance.removeLayer(mapInstance.marker);
    }
    mapInstance.marker = L.marker([lat, lng], { draggable: true }).addTo(
      mapInstance
    );

    mapInstance.marker.on("dragend", () => {
      const position = mapInstance.marker.getLatLng();
      selectedLocation.value = {
        lat: position.lat.toFixed(6),
        lng: position.lng.toFixed(6),
      };
    });
  });
};

// Submit form data to the API
const handleSubmitToAPI = async () => {
  if (!selectedLocation.value) {
    alert("لطفاً موقعیت مکانی خود را انتخاب کنید");
    return;
  }

  const finalData = {
    first_name: form.first_name,
    last_name: form.last_name,
    coordinate_mobile: form.coordinate_mobile,
    coordinate_phone_number: form.coordinate_phone_number || "",
    address: form.address,
    gender: form.gender,
    region: form.region,
    lat: selectedLocation.value.lat,
    lng: selectedLocation.value.lng,
  };

  try {
    loading.value = true;
    const response = await fetch(
      "https://stage.achareh.ir/api/karfarmas/address",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic MDk4MjIyMjIyMjI6U2FuYTEyMzQ1Njc4",
        },
        body: JSON.stringify(finalData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "خطا در ارسال اطلاعات");
    }

    const responseData = await response.json();
    showNotif.value = true;
    console.log("Response from API:", responseData);
  } catch (error) {
    alert(`خطا: ${error.message}`);
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (showMap.value) {
    initializeMap();
  }
});
</script>

<style scoped>
.custom-focus:focus {
  border-color: #00bfa6; /* Change the border color */
  box-shadow: 0 0 5px #00bfa6; /* Add a glow effect */
  outline: none; /* Remove the default outline */
}
.form-check-input:checked {
  border-color: #00bfa6;
  background-color: #00bfa6;
  box-shadow: 0 0 5px #00bfa6;
}
.custom-focus::placeholder {
  color: #ced4da; /* Change this to any color you want */
}
.text-danger {
  color: red;
  font-size: 0.875rem;
}
</style>
