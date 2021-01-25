/**
* Created by vouill on 11/13/17.
*/

<template>
    <div>
        <b-container>
            <b-row>
                <div class="col-sm-8 offset-sm-2">

                    <b-card>
                        <b-card-title>
                            سوالات متداول
                        </b-card-title>

                        <b-form @submit="onSubmit" v-if="status!=='success'">
                            <b-form-group label="کدملی:">
                                <b-form-input placeholder="کدملی خود را وارد کنید"
                                              type="text"
                                              v-model="username">
                                </b-form-input>
                                <span class="error" v-for="e in error.username">{{e}}</span>
                            </b-form-group>
                            <b-form-group description="گذرواژه باید حداقل ۸ حرف باشد و ترکیبی از اعداد و حروف باشد"
                                          label="گذرواژه:">
                                <b-form-input placeholder="گذرواژه را وارد کنید" type="password"
                                              v-model="password">
                                </b-form-input>
                                <span class="error" v-for="e in error.password">{{e}}</span>
                            </b-form-group>

                            <b-form-group align="center">
                                <b-button :disabled="status==='sending'" type="submit" variant="success">
                                    <span v-show="status!=='sending'">ورود</span>
                                    <span v-show="status==='sending'">در حال ارسال</span>
                                </b-button>
                            </b-form-group>
                            <p class="error" v-if="status==='error'">
                                ورود با مشکل مواجه شد
                            </p>
                        </b-form>
                        <hr/>
                        <p>
                            حساب کاربری ندارید؟
                            <router-link :to="{name:'SignUp'}">هم‌اکنون ایجاد کنید</router-link>
                        </p>
                        <p>
                            <router-link :to="{name:'ResetPassword'}">
                                گذرواژه خود را فراموش کرده‌اید؟
                            </router-link>
                        </p>
                    </b-card>
                </div>
            </b-row>
        </b-container>

    </div>
</template>

<style>
    .login {
        display: flex;
        flex-direction: column;
        width: 300px;
        padding: 10px;
    }
</style>

<script>
    import {AUTH_LOGOUT, AUTH_REQUEST} from '@/utils/constants'

    export default {
        name: 'Login',
        data() {
            return {
                status: 'default',
                username: '',
                password: '',
                error: {
                    username: [],
                    password: [],
                }
            }
        },
        created() {
            this.$store.dispatch(AUTH_LOGOUT)
        },
        methods: {
            onSubmit: function (e) {
                e.preventDefault()
                this.status = 'sending'
                const {username, password} = this
                this.$store.dispatch(AUTH_REQUEST, {username, password}).then(() => {
                    this.status = 'success'
                    this.$router.push('/')
                }).catch(error => {
                    this.error = error.response.data
                    this.status = 'error'
                })
            }
        },
    }
</script>
