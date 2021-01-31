<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <h1>
                    اطلاعیه‌ها
                </h1>
                <b-card v-for="post in orderedPosts"
                        :footer="post.post_date | moment | jalaliWithTime | pNumber">
                    <div v-html="post.text"></div>
                </b-card>
            </b-col>
            <b-col>
                <div v-if="$parent.hasRegistration">
                    <h1>
                        ثبت‌نام من
                    </h1>
                    <br>
                    <div>
                        <label>
                            وضعیت:
                        </label>
                        <span class="answer">
                            {{status_display}}
                        </span>
                    </div>
                    <div v-if="$parent.program.has_coupling">
                        <label>
                            متاهلی:
                        </label>
                        <span class="answer">
                            {{$parent.program.registration.coupling?'بله':'خیر'}}
                        </span>
                    </div>
                    <div v-for="qa in answers">
                        <label>
                            {{qa.title}}:
                        </label>
                        <span v-if="qa.var === 'yesno'" class="answer">
                            {{qa.yes?'بله':'خیر'}}
                        </span>
                        <span v-if="qa.var === 'multiple'" class="answer">
                            {{qa.answer_text ? qa.options[qa.answer_text] : 'پاسخ داده نشده'}}
                        </span>
                        <span v-if="qa.var === 'file'" class="answer">
                            <template v-if="qa.answer_file">
                                <a v-bind:href="qa.answer_file">
                                    مشاهده فایل
                                </a>
                            </template>
                            <template v-else>
                                فایلی ارسال نشده
                            </template>
                        </span>
                    </div>
                    <div v-if="!!$parent.program.registration.sum_payed">
                        <label>
                            مجموع پرداختی تاکنون:
                        </label>
                        <span class="answer">
                            {{$parent.program.registration.sum_payed | pNumber}}
                            تومان
                        </span>
                    </div>
                    <div v-if="$parent.program.registration.status==='certain' && !!$parent.program.registration.next_installment">
                        <b-button @click="pay" variant="success" :disabled="status==='sending'">
                            <span v-show="status==='default'">
                            پرداخت مبلغ
                            {{$parent.program.registration.next_installment | pNumber}}
                            تومان
                            </span>
                            <span v-show="status==='sending'">
                           درحال انجام
                            </span>
                            <span v-show="status==='error'">
                           پرداخت با مشکل مواجه شد
                            </span>

                        </b-button>
                    </div>
                    <div v-if="$parent.program.registration.status==='certain' || $parent.program.registration.status==='default' || $parent.program.registration.status==='reserved'">
                        <b-button @click="giveUp" variant="danger">
                            انصراف
                        </b-button>
                    </div>
                </div>
                <div v-else>
                    <h1>
                        ثبت‌نام
                    </h1>
                    <br>
                    <p v-if="!$parent.program.is_open">
                        اکنون زمان ثبت‌نام نیست
                    </p>
                    <p v-else-if="!isAuthenticated">
                        ابتدا باید
                        <router-link :to="{name:'Login'}">
                            وارد شوید
                        </router-link>
                    </p>
                    <p v-else-if="!isProfileCompleted">
                        شما هنوز شماره موبایل و سایر اطلاعات ضروری را در
                        <router-link :to="{name:'Profile.Base'}">
                            صفحه پروفایل
                        </router-link>
                        خود تکمیل نکرده‌اید.
                    </p>
                    <div v-else>
                        <div v-if="$parent.program.has_coupling && isMarried">
                            <span class="question-item">
                                شرکت به صورت متاهلی:
                            </span>
                            <input type="checkbox" v-model="newRegistration.coupling"/>
                            <hr>
                        </div>
                        <div v-for="(question, i) in newRegistration.answers">
                            <span class="question-item">
                              {{question.title}}
                                :
                            </span>
                            <template v-if="question.var=='yesno'">
                                <input type="checkbox" v-model="question.yes"/>
                            </template>
                            <template v-if="question.var=='multiple'">
                                <template v-for="(x,i) in question.options">
                                    <input type="radio" :value="i" v-model="question.answer_text">
                                    <label>{{x}}</label>
                                </template>
                            </template>
                            <template v-if="question.var=='file'">
                                <input type="file" @change="fileChange" v-bind:id="'filein'+i">
                                <p class="error" v-if="question.file_is_big">
                                    فایل ارسالی حداکثر باید یک مگابایت باشد.
                                </p>
                            </template>
                            <p>
                                {{question.desc}}
                            </p>
                            <hr>
                        </div>
                        <b-button variant="success" @click="register" :disabled="status==='sending'">
                            <span v-show="status!=='sending'">
                            ثبت‌نام در برنامه
                            </span>
                         <span v-show="status==='sending'">
                           در حال انجام
                            </span>
                        </b-button>
                        <p class="error" v-if="status==='error'">
                            ثبت‌نام در برنامه با مشکل مواجه شد
                        </p>

                    </div>
                </div>
            </b-col>
        </b-row>
        <form ref="hiddenForm" action="https://bpm.shaparak.ir/pgwchannel/startpay.mellat" method="POST">
            <input ref="refref" type="hidden" name="RefId" :value="refId">
            <input type="submit" value="go" style="display: none;">
        </form>
    </b-container>

</template>
<script>
    import {HTTP} from '../utils/index';
    import {mapGetters} from 'vuex'
    import {STATUS_CHOICES} from '@/utils/choices'
    import Vue from 'vue';

    export default {
        name: 'ProgramMain',
        data() {
            return {
                status: 'default',
                refId: '',
                newRegistration: {
                    coupling: false,
                    answers: []
                }
            }
        },
        created() {
            this.constructNewRegistration();
            this.$parent.$on('fetched', this.constructNewRegistration);
        },
        methods: {
            fileChange(e) {
                console.log(e);
                const question = this.newRegistration.answers[e.target.id.slice(6)];
                var reader = new FileReader();
                reader.onload = function(e) {
                    if (e.target.result.length > 1500000) {
                        Vue.set(question, 'file_is_big', true);
                    }
                    else {
                        question.answer_file = e.target.result;             
                    }
                    console.log(question);
                };
                reader.onerror = function(error) {
                    alert(error);
                };
                reader.readAsDataURL(e.target.files[0]); 
            },
            pay() {
                this.status = 'sending'
                HTTP.post('pay/registration/start/', {'registration_id': this.$parent.program.registration.id}).then(resp => {
                    this.refId = resp.data
                    this.$refs.refref.value = resp.data
                    this.$refs.hiddenForm.submit();
                }).catch(error => {
                    this.status = 'error'
                })
            },
            giveUp() {
                this.$dialog.confirm('آیا مطمئنید که می‌خواهید انصراف بدهید؟').then(dialog => {
                    HTTP.post('registration/give_up/', {'registration_id': this.$parent.program.registration.id}).then(resp => {
                        this.$parent.program.registration.status = 'given up'
                    })
                });
            },
            constructNewRegistration() {
                for (let question of this.$parent.program.users_questions) {
                    let temp = _.find(this.newRegistration.answers, {'question_id': question.id})
                    if (!temp) {
                        this.newRegistration.answers.push({
                            question_id: question.id,
                            var: question.var,
                            title: question.title,
                            desc: question.desc,
                            options: question.var === 'multiple' ? question.params.split('-') : [],
                            yes: false
                        })
                    }
                }
            },
            register(){
                this.status = 'sending'
                HTTP.post('program/register/'+this.$parent.program.id+'/', this.newRegistration).then(resp => {
                    this.$parent.program.registration=resp.data;
                    this.status = 'default';
                }).catch(error => {
                    this.status = 'error'
                })
            },
        },
        computed: {
            ...mapGetters(['getUser', 'isAuthenticated', 'isProfileLoaded', 'isProfileCompleted', 'isMarried']),
            status_display: function () {
                return STATUS_CHOICES[this.$parent.program.registration.status]
            },
            answers: function () {
                return _.map(this.$parent.program.users_questions, item => {
                    let ans = {
                        title: item.title,
                        var: item.var,
                        options: item.var === 'multiple' ? item.params.split('-') : [],
                    };
                    let found_answer = _.find(this.$parent.program.registration.answers, {'question': item.id})
                    if (found_answer) {
                        ans = {
                            ...ans,
                            ...found_answer,
                        };
                    } else {
                        ans['yes'] = false
                    }
                    return ans;

                })
            },
            orderedPosts(){
                return _.orderBy(this.$parent.program.posts,'post_date','desc')
            }
        }
    }
</script>
<style>
    .answer {
        font-weight: bold;
    }

    .question-item {
        font-weight: bold;
    }
</style>