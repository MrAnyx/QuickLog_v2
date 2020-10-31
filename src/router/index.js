import Vue from "vue";
import VueRouter from "vue-router";

// Components
import Passwords from "@/views/Security/Passwords";
import Payment from "@/views/Security/Payment";
import Notes from "@/views/Security/Notes";

import Dashboard from "@/views/Manager/Dashboard";

import Login from "@/views/Login/Login";
import Register from "@/views/Login/Register";

import Page404 from "@/views/Error/Page404";

Vue.use(VueRouter);

const { ipcRenderer } = window;

const routes = [
	{
		path: "/",
		redirect: "login"
	},
	{
		path: "/login",
		name: "login",
		component: Login,
	},
	{
		path: "/register",
		name: "register",
		component: Register,
	},
	{
		path: "/passwords",
		name: "passwords",
		component: Passwords,
	},
	{
		path: "/payment",
		name: "payment",
		component: Payment,
	},
	{
		path: "/notes",
		name: "notes",
		component: Notes,
	},
	{
		path: "/dashboard",
		name: "dashboard",
		component: Dashboard,
	},
	{
		path: "*",
		name: "404",
		component: Page404
	},
];

const router = new VueRouter({
	mode: "history",
	routes,
});

export default router;
