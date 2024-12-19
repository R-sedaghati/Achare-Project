<template>
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
                value="male"
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
                value="female"
                name="flexRadioDefault"
                id="'male'"
                checked
              />
              <label class="form-check-label" for="'male'"> آقا </label>
            </div>
          </div>
        </form>
      </div>
    </template>
    <template v-if="showMap">
      <p class="fs-2 ps-4 pt-3 pt-md-5 text-center">انتخاب آدرس</p>
      <div class="container bg-white hy-auto mt-4 mt-md-5">
        <div class="mt-5">
          <h5 class="text-center">لطفاً موقعیت خود را انتخاب کنید:</h5>
          <div id="map" style="height: 400px; width: 100%"></div>
          <p class="mt-3">مختصات: {{ selectedLocation }}</p>
        </div>
      </div>
    </template>
  </div>
  <div>
    <div class="col-12 d-grid pt-4 w-50 mx-auto mx-md-auto">
      <button
        @click="handleSubmit"
        class="btn text-white p-2"
        style="background-color: #00bfa6"
      >
        ثبت و ادامه
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, nextTick, onMounted } from "vue";
import L from "leaflet";

const form = reactive({
  first_name: "",
  last_name: "",
  coordinate_mobile: "",
  coordinate_phone_number: "",
  address: "",
  gender: "",
});

const errors = reactive({});
const showMap = ref(false);
const selectedLocation = ref("No location selected");
let mapInstance = null;

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

const handleSubmit = () => {
  validate();
  initializeMap();

  if (!Object.values(errors).some((error) => error)) {
    alert("فرم با موفقیت ارسال شد!");
    showMap.value = true;
    initializeMap();
  }
};

const initializeMap = async () => {
  await nextTick(); // Ensure the DOM is updated before initializing the map

  if (mapInstance) {
    console.log("Map is already initialized.");
    return; // Exit if the map instance already exists
  }

  // Initialize the map with default coordinates (Tehran)
  mapInstance = L.map("map").setView([35.6997, 51.338], 18);

  // Add the OpenStreetMap tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(mapInstance);

  // Add click event listener to the map
  mapInstance.on("click", (e) => {
    const { lat, lng } = e.latlng; // Get latitude and longitude
    selectedLocation.value = `Latitude: ${lat.toFixed(
      6
    )}, Longitude: ${lng.toFixed(6)}`;

    // Remove existing marker if present and add a new one
    if (mapInstance.marker) {
      mapInstance.removeLayer(mapInstance.marker);
    }
    mapInstance.marker = L.marker([lat, lng], { draggable: true }).addTo(
      mapInstance
    );

    // Update coordinates on marker drag
    mapInstance.marker.on("dragend", () => {
      const position = mapInstance.marker.getLatLng();
      selectedLocation.value = `Latitude: ${position.lat.toFixed(
        6
      )}, Longitude: ${position.lng.toFixed(6)}`;
    });
  });
};

// Initialize the map when the component is mounted
onMounted(() => {
  initializeMap();
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
