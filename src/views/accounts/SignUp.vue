/**
* Created by vouill on 11/13/17.
*/

<template>
    <div>
        <br>
        <b-container>
            <b-form @submit="onSubmit" v-if="status!=='success'">
                <b-form-group label="کدملی:">
                    <b-form-input type="text"
                                  v-model="user.username"
                                  placeholder="کدملی خود را وارد کنید">
                    </b-form-input>
                    <span class="error" v-if="!$v.user.username.validateMelliCode">فرمت کد ملی درست نیست</span>
                    <span class="error" v-for="e in error.username">{{e}}</span>
                </b-form-group>
                <b-form-group label="ایمیل:"
                description="ترجیحا از جیمیل استفاده کنید و به هیچ وجه از ایمیل یاهو استفاده نکنید">
                    <b-form-input type="email"
                                  v-model="user.email"
                                  placeholder="ایمیل خود را وارد کنید">
                    </b-form-input>
                    <span class="error" v-for="e in error.email">{{e}}</span>
                </b-form-group>
                <b-form-group label="نام:">
                    <b-form-input type="text"
                                  v-model="user.first_name"
                                  required
                                  placeholder="نام خود را وارد کنید">
                    </b-form-input>
                </b-form-group>
                <b-form-group label="نام خانوادگی:">
                    <b-form-input type="text"
                                  v-model="user.last_name"
                                  required
                                  placeholder="نام خانوادگی خود را وارد کنید">
                    </b-form-input>
                </b-form-group>
                <b-form-group label="گذرواژه:"
                              description="گذرواژه باید حداقل ۸ حرف باشد و ترکیبی از اعداد و حروف باشد">
                    <b-form-input v-model="user.password" type="password"
                                  placeholder="گذرواژه را وارد کنید">
                    </b-form-input>
                    <span class="error" v-for="e in error.password">{{e}}</span>
                </b-form-group>

                <b-button type="submit" variant="success" :disabled="status==='sending'|| $v.$invalid">
                    <span v-show="status!=='sending'">ایجاد حساب کاربری</span>
                    <span v-show="status==='sending'">در حال ارسال</span>
                </b-button>
            </b-form>
            <p v-if="status==='success'">
                حساب کاربری ایجاد شد.
            </p>
        </b-container>
    </div>

</template>

<style>

</style>

<script>
    import {HTTP} from '@/utils'
    import {validateMelliCode} from "../../utils/validators";
    import {required} from 'vuelidate/lib/validators'

    export default {
        name: 'SignUp',
        data() {
            return {
                status: 'default',
                user: {
                    first_name: '',
                    last_name: '',
                    email: '',
                    username: '',
                    password: ''
                },
                error: {
                    first_name: [],
                    last_name: [],
                    email: [],
                    username: [],
                    password: []
                }
            }
        },
        validations: {
            user: {
                username: {
                    required,
                    validateMelliCode
                },
                email: {
                    required
                },
                first_name: {
                    required
                },
                last_name: {
                    required
                },
                password: {
                    required
                }
            }
        },
        methods: {
            onSubmit: function (e) {
                e.preventDefault();
                this.status = 'sending';
                HTTP.post('auth/users/', this.user).then(resp => {
                    this.status = 'success'
                }).catch(error=>{
                    this.status='error'
                    this.error=error.response.data
                })
            }
        },
    }
</script>
