import { reactive } from "vue";
import { io } from "socket.io-client";
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: []
});

// "undefined" means the URL will be computed from the `window.location` object
export const URL =
  process.env.NODE_ENV === "production" ? BACKEND_URL : "http://localhost:3001";
// export const URL = VUE_APP_BACKEND_URL;

export const socket = io(URL);

socket.on("connect", () => {
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});

socket.on("test", data => {
  console.log("test", data);
});

// socket.on("completedItem", data => {
//   console.log("completedItem", data);
//   console.log("GGGGG");
// });

socket.on("foo", (...args) => {
  state.fooEvents.push(args);
});

socket.on("bar", (...args) => {
  state.barEvents.push(args);
});
