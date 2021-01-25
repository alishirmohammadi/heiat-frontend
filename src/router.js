import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Program from './views/Program'
import ProgramMain from './views/ProgramMain'
import ProgramPayments from './views/ProgramPayments'
import ProgramMessages from './views/ProgramMessages'
import Login from './views/accounts/Login.vue'
import ResetPassword from './views/accounts/ResetPassword'
import ResetPasswordConfirm from './views/accounts/ResetPasswordConfirm'
import SignUp from './views/accounts/SignUp'
import Activate from './views/accounts/Activate'
import Profile from './views/accounts/Profile.vue'
import ProfileUser from './views/accounts/ProfileUser'
import ProfileCouple from './views/accounts/ProfileCouple'
import ProfileBase from './views/accounts/ProfileBase'
import ProfilePassport from './views/accounts/ProfilePassport'
import ProfileChangePassword from './views/accounts/ProfileChangePassword'
import store from '@/store'
import DiningCancel from "./views/dining/DiningCancel";

Vue.use(Router)

const ifNotAuthenticated = (to, from, next) => {
    if (!store.getters.isAuthenticated) {
        next()
        return
    }
    next('/profile')
}

const ifAuthenticated = (to, from, next) => {
    if (store.getters.isAuthenticated) {
        next()
        return
    }
    next('/login')
}

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/dining/cancel/:meal_id',
            name: 'ResetPasswordConfirm',
            component: DiningCancel,
        },
        {
            path: '/login',
            name: 'Login',
            component: Login,
            beforeEnter: ifNotAuthenticated,
        },
        {
            path: '/password/reset/confirm/:uid/:token',
            name: 'ResetPasswordConfirm',
            component: ResetPasswordConfirm,
        },
        {
            path: '/password/reset',
            name: 'ResetPassword',
            component: ResetPassword,
            beforeEnter: ifNotAuthenticated,
        },
        {
            path: '/signup',
            name: 'SignUp',
            component: SignUp,
            beforeEnter: ifNotAuthenticated,
        },
        {
            path: '/activate/:uid/:token',
            name: 'Activate',
            component: Activate
        },
        {
            path: '/profile/',
            component: Profile,
            beforeEnter: ifAuthenticated,
            children: [

                {
                    path: 'passport',
                    name: 'Profile.Passport',
                    component: ProfilePassport
                },
                {
                    path: 'change/password',
                    name: 'Profile.ChangePassword',
                    component: ProfileChangePassword
                },
                {
                    path: 'user',
                    name: 'Profile.User',
                    component: ProfileUser
                },
                {
                    path: 'couple',
                    name: 'Profile.Couple',
                    component: ProfileCouple
                },
                {
                    path: '',
                    name: 'Profile.Base',
                    component: ProfileBase
                }
            ]
        },
        {
            path: '/program/:program_id',
            component: Program,
            children: [
                {
                    path: '',
                    name: 'Program.Main',
                    component: ProgramMain
                },
                {
                    path: 'payments',
                    name: 'Program.Payments',
                    component: ProgramPayments
                },
                {
                    path: 'messages',
                    name: 'Program.Messages',
                    component: ProgramMessages
                },
            ]
        },
        {
            path: '/help/FAQ',
            name: 'FAQ',
            component: () => import(/* webpackChunkName: "about" */ './views/FAQ.vue')
        },
        {
            path: '/help/status',
            name: 'HelpStatus',
            component: () => import(/* webpackChunkName: "about" */ './views/HelpStatus.vue')
        },
        {
            path: '/pay/terminal/:expense_id?',
            name: 'Terminal',
            component: () => import(/* webpackChunkName: "terminal" */ './views/Terminal.vue')
        },
        {
            path: '/t/:expense_address?',
            name: 'Terminal',
            component: () => import(/* webpackChunkName: "terminal" */ './views/Terminal.vue')
        },
        {
            path: '/t/:expense_address?/:amount?',
            name: 'Terminal',
            component: () => import(/* webpackChunkName: "terminal" */ './views/Terminal.vue')
        },
        {
            path: '/t/:expense_address?/:amount?/:direct?',
            name: 'Terminal',
            component: () => import(/* webpackChunkName: "terminal" */ './views/Terminal.vue')
        },
        {
            path: '/pay/terminal',
            name: 'Terminal',
            component: () => import(/* webpackChunkName: "terminal" */ './views/Terminal.vue')
        },
        {
            path: '/managements',
            name: 'Managements',
            component: () => import(/* webpackChunkName: "manage" */ './views/manage/Managements')
        },
        {
            path: '/manage/:program_id',
            component: () => import(/* webpackChunkName: "manage" */ './views/manage/Manage'),
            children: [
                {
                    path: '',
                    name: 'Manage.Panel',
                    component: () => import(/* webpackChunkName: "manage" */ './views/manage/ManagePanel'),
                },
                {
                    path: 'posts',
                    name: 'Manage.Posts',
                    component: () => import(/* webpackChunkName: "manage" */ './views/manage/ManagePosts'),
                },
                {
                    path: 'program',
                    name: 'Manage.Program',
                    component: () => import(/* webpackChunkName: "manage" */ './views/manage/ManageProgram'),
                },
                {
                    path: 'questions',
                    name: 'Manage.Questions',
                    component: () => import(/* webpackChunkName: "manage" */ './views/manage/ManageQuestions'),
                },
                {
                    path: 'inbox',
                    name: 'Manage.Inbox',
                    component: () => import(/* webpackChunkName: "manage" */ './views/manage/ManageInbox'),
                },
                {
                    path: 'registration/:registration_id',
                    component: () => import(/* webpackChunkName: "manage" */ './views/manage/ManageRegistration'),
                    children: [
                        {
                            path: '',
                            name: 'Manage.Registration.Main',
                            component: () => import(/* webpackChunkName: "manage" */ './views/manage/ManageRegistrationMain'),
                        },
                        {
                            path: 'messages',
                            name: 'Manage.Registration.Messages',
                            component: () => import(/* webpackChunkName: "manage" */ './views/manage/ManageRegistrationMessages'),
                        },
                        {
                            path: 'payments',
                            name: 'Manage.Registration.Payments',
                            component: () => import(/* webpackChunkName: "manage" */ './views/manage/ManageRegistrationPayments'),
                        },
                    ]
                }
            ]

        }
    ]
})
