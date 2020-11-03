import Vue from "vue";
import VueRouter from "vue-router";

// Components
import Passwords from "@/views/Security/Passwords";
import Payment from "@/views/Security/Payment";
import Notes from "@/views/Security/Notes";

import Dashboard from "@/views/Manager/Dashboard";

import Login from "@/views/Login/Login";
import Register from "@/views/Login/Register";

import Redirect from "@/views/Redirect/Redirect";

import Page404 from "@/views/Error/Page404";

import Settings from "@/views/Other/Settings";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		redirect: "redirect"
	},
	{
		path: "/index.html",
		redirect: "redirect"
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
		path: "/redirect",
		name: "redirect",
		component: Redirect,
	},
	{
		path: "/settings",
		name: "settings",
		component: Settings,
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
