import Vue from "vue";
import VueRouter from "vue-router";

const { ipcRenderer } = window;

// Components
import Passwords from "@/views/Security/Passwords";
import Payment from "@/views/Security/Payment";
import Notes from "@/views/Security/Notes";

import Dashboard from "@/views/Manager/Dashboard";

import Login from "@/views/Login/Login";
import Register from "@/views/Login/Register";

import Page404 from "@/views/Error/Page404";

import Settings from "@/views/Other/Settings";

Vue.use(VueRouter);

const metaVerificationAuthentication = (to, from, next) => {
	ipcRenderer.send("IS_CONNECTED");
	ipcRenderer.once("IS_CONNECTED_REPLY", (event, isConnected) => {
		if (isConnected) {
			next(); // allow to enter route
		} else {
			next({ name: "login" }); // go to '/login';
		}
	});
};

const metaVerificationAlreadyLoggedIn = (to, from, next) => {
	ipcRenderer.send("IS_CONNECTED");
	ipcRenderer.once("IS_CONNECTED_REPLY", (event, isConnected) => {
		if (isConnected) {
			next({ name: "passwords" });
		} else {
			next();
		}
	});
 }

const routes = [
	{
		path: "/index.html",
		redirect: "login",
	},
	{
		path: "/",
		redirect: "login",
	},
	{
		path: "/login",
		name: "login",
		component: Login,
		beforeEnter: metaVerificationAlreadyLoggedIn
	},
	{
		path: "/register",
		name: "register",
		component: Register,
		beforeEnter: metaVerificationAlreadyLoggedIn
	},
	{
		path: "/passwords",
		name: "passwords",
		component: Passwords,
		beforeEnter: metaVerificationAuthentication,
	},
	{
		path: "/payment",
		name: "payment",
		component: Payment,
		beforeEnter: metaVerificationAuthentication,
	},
	{
		path: "/notes",
		name: "notes",
		component: Notes,
		beforeEnter: metaVerificationAuthentication,
	},
	{
		path: "/dashboard",
		name: "dashboard",
		component: Dashboard,
		beforeEnter: metaVerificationAuthentication,
	},
	{
		path: "/settings",
		name: "settings",
		component: Settings,
		beforeEnter: metaVerificationAuthentication,
	},
	{
		path: "*",
		name: "404",
		component: Page404,
	},
];

const router = new VueRouter({
	mode: "history",
	routes,
});

export default router;
