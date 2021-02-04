<template>
    <b-container fluid>
        <div>
            <b-row>
                <b-col>
                    <div>
                        <div>
                            <label>
                                وضعیت:
                            </label>
                            <span style="margin-right: -7px; display: inline">
                                <b-form-checkbox-group plain v-model="filter.status" :options="choices.status">
                                </b-form-checkbox-group>
                            </span>
                        </div>
                        <b-collapse id="more_filter">
                            <div>
                                <label>
                                    وضعیت تحصیل:
                                </label>
                                <span style="margin-right: -7px; display: inline">
                                <b-form-checkbox-group plain v-model="filter.people_type"
                                                       :options="choices.people_type">
                                </b-form-checkbox-group>
                            </span>
                            </div>
                            <div>
                                <label>
                                    تعداد قسط پرداخت شده:
                                </label>
                                <span style="margin-right: -7px; display: inline">
                                <b-form-checkbox-group plain v-model="filter.numberOfPayments">
                                    <b-form-checkbox :value="0">بدون پرداخت</b-form-checkbox>
                                    <b-form-checkbox :value="1">قسط اول</b-form-checkbox>
                                    <b-form-checkbox :value="2">دو قسط</b-form-checkbox>
                                    <b-form-checkbox :value="3">سه قسط</b-form-checkbox>
                                </b-form-checkbox-group>
                            </span>
                            </div>
                            <div>
                                <label>
                                    جنسیت:
                                </label>
                                <span style="margin-right: -7px; display: inline">
                                <b-form-checkbox-group plain v-model="filter.gender">
                                    <b-form-checkbox value="مرد">مرد</b-form-checkbox>
                                    <b-form-checkbox value="زن">زن</b-form-checkbox>
                                </b-form-checkbox-group>
                            </span>
                            </div>
                            <div v-if="$parent.program.has_coupling">
                                <label>
                                    متاهلی:
                                </label>
                                <span style="margin-right: -7px; display: inline">
                                <b-form-checkbox-group plain v-model="filter.coupling">
                                    <b-form-checkbox value="بله">بله</b-form-checkbox>
                                    <b-form-checkbox value="خیر">خیر</b-form-checkbox>
                                </b-form-checkbox-group>
                            </span>
                            </div>
                            <div v-if="$parent.program.type==='arbaeen'">
                                <label>
                                    وضعیت گذرنامه:
                                </label>
                                <span style="margin-right: -7px; display: inline">
                                <b-form-checkbox-group plain v-model="filter.passport">
                                    <b-form-checkbox value="دارم">دارم</b-form-checkbox>
                                    <b-form-checkbox value="ندارم">ندارم</b-form-checkbox>
                                </b-form-checkbox-group>
                            </span>
                            </div>
                            <div v-if="$parent.program.type==='arbaeen'">
                                <label>
                                    وضعیت نظام وظیفه:
                                </label>
                                <span style="margin-right: -7px; display: inline">
                                <b-form-checkbox-group plain v-model="filter.conscription"
                                                       :options="choices.conscription">
                                </b-form-checkbox-group>
                            </span>
                            </div>
                            <div>
                                <label>
                                    مقطع:
                                </label>
                                <span style="margin-right: -7px; display: inline">
                                <b-form-checkbox-group plain v-model="filter.level">
                                    <b-form-checkbox value="کارشناسی">کارشناسی</b-form-checkbox>
                                    <b-form-checkbox value="کارشناسی ارشد">کارشناسی ارشد</b-form-checkbox>
                                    <b-form-checkbox value="دکترا">دکترا</b-form-checkbox>
                                </b-form-checkbox-group>
                            </span>
                            </div>
                            <div>
                                <label>
                                    سال ورود:
                                </label>
                                <span style="margin-right: -7px; display: inline">
                                <b-form-checkbox-group plain v-model="filter.year"
                                                       :options="years">
                                </b-form-checkbox-group>
                            </span>
                            </div>
                            <div v-for="question in $parent.program.questions">
                                <label>
                                    {{question.title}}:
                                </label>
                                <span style="margin-right: -7px; display: inline">
                                <b-form-checkbox-group plain v-model="filter[question.title]">
                                    <b-form-checkbox value="بله">بله</b-form-checkbox>
                                    <b-form-checkbox value="خیر">خیر</b-form-checkbox>
                                </b-form-checkbox-group>
                            </span>
                            </div>

                        </b-collapse>

                    </div>
                    <div>
                        <b-button variant="success" :disabled="fetchStatus==='fetching'" @click="fetchData">
                            <span v-show="fetchStatus!=='fetching'">بارگیری مجدد از سرور</span>
                            <span v-show="fetchStatus==='fetching'">در حال بارگیری</span>
                        </b-button>
                        <b-button variant="secondary" @click="excel">
                            خروجی اکسل از
                            {{filtered.length | pNumber}}
                            مورد در حال نمایش
                        </b-button>

                        <b-button variant="info" v-b-toggle.more_filter>
                            فیلتر بیشتر
                        </b-button>
                    </div>
                </b-col>
                <b-col>
                    <b-button variant="info" v-b-toggle.show_columns>
                        ستون‌های جدول
                    </b-button>
                    <b-collapse id="show_columns">
                        <b-form-checkbox-group :options="availableFields" plain v-model="fields">
                        </b-form-checkbox-group>
                    </b-collapse>

                </b-col>
            </b-row>
        </div>
        <hr>
        <div class="well">
            <b-table :fields="fields" :items="filtered" bordered class="table-responsive-md" hover outlined striped>
                <template v-slot:cell(بارکد)="data">

                    <qrcode :options="{width: 200}" :value="data.item['بارکد']" tag="img"></qrcode>
                </template>
                <template v-slot:cell(اعمال)="data">
                    <router-link
                            :to="{name:'Manage.Registration.Main',params:{program_id:$parent.program.id,registration_id:data.item['ردیف']}}">
                        <b-icon-info-fill/>
                    </router-link>
                    <router-link
                            :to="{name:'Manage.Registration.Messages',params:{program_id:$parent.program.id,registration_id:data.item['ردیف']}}">
                        <b-icon-envelope-fill/>
                    </router-link>
                    <router-link
                            :to="{name:'Manage.Registration.Payments',params:{program_id:$parent.program.id,registration_id:data.item['ردیف']}}">
                        <b-icon-wallet/>
                    </router-link>
                </template>



            </b-table>

        </div>
        <hr>
        <b-row>
            <b-col>
                <div>
                    <b-form-select :options="STATUS_CHOICES" style="width: 50%" v-model="new_status"/>
                    <b-button :disabled="status==='sending'" @click="changeStatus" variant="success">
                        <span v-show="status!=='sending'">تغییر وضعیت</span>
                        <span v-show="status==='sending'">لطفا کمی صبر کنید</span>
                    </b-button>
                </div>
                <div v-if="$parent.program.questions.length>0">
                    <b-form-select :options="questions" style="width: 35%" v-model="question_id"/>
                    <b-form-select style="width: 35%" v-model="yes">
                        <option :value="false">خیر</option>
                        <option :value="true">بله</option>
                    </b-form-select>
                    <b-button :disabled="status==='sending' || question_id===null || yes=== null"
                              @click="changeAnswer" variant="success">
                        <span v-show="status!=='sending'">تغییر</span>
                        <span v-show="status==='sending'">لطفا کمی صبر کنید</span>
                    </b-button>
                </div>
                <div>
                    <label>
                        تعداد برای قرعه‌کشی:
                    </label>
                    <input type="number" v-model="chances"/>
                    <b-button :disabled="status==='sending' || chances<=0" @click="draw" variant="success">
                        <span v-show="status!=='sending'">قرعه‌کشی</span>
                        <span v-show="status==='sending'">لطفا کمی صبر کنید</span>
                    </b-button>
                </div>
            </b-col>
            <b-col>
                <div>
                                <textarea v-model="newMessageText" style="width: 100%">

                                </textarea>
                    <b-button :disabled="status==='sending' || newMessageText===''" @click="send" variant="success">
                        <span v-show="status!=='sending'">ارسال</span>
                        <span v-show="status==='sending'">در حال ارسال</span>
                    </b-button>
                    <label>
                        ارسال پیامک
                    </label>
                    <input type="checkbox" v-model="send_sms"/>
                    <label>
                        تعداد حرف:
                    </label>
                    <span>
                {{newMessageText.length | pNumber}}
            </span>
                </div>
            </b-col>
        </b-row>
    </b-container>

</template>
<script>
    import {exportExcel, HTTP} from '@/utils/index';
    import {mapGetters} from 'vuex'
    import {flatRegistrations} from '@/utils/specifics'
    import {CONSCRIPTION_VALUES, PEOPLE_TYPE_VALUES, STATUS_CHOICES, STATUS_VALUES} from '@/utils/choices'
    import VueQrcode from '@chenfengyuan/vue-qrcode';
    import Vue from 'vue';

    Vue.component("qrcode", VueQrcode);

    export default {
        name: 'ManagePanel',

        data() {
            return {
                registrations: [],
                availableFields: ['ردیف', 'نام', 'بارکد', 'وضعیت تحصیل', 'وضعیت', 'متاهلی', 'جنسیت', 'تعداد قسط', 'تاریخ ثبت‌نام', 'وضعیت گذرنامه', 'وضعیت نظام وظیفه', 'کد ملی', 'ایمیل', 'شماره موبایل', 'نام پدر', 'شماره گذرنامه', 'تاریخ صدور گذرنامه', 'تاریخ انقضای گذرنامه', 'شماره دانشجویی', 'مقطع', 'سال ورود', 'تاریخ تولد شمسی', 'تاریخ تولد میلادی', 'اعمال', ..._.map(this.$parent.program.questions, 'title')],
                fields: ['ردیف', 'نام', 'وضعیت تحصیل', 'وضعیت', 'اعمال'],
                fetchStatus: 'default',
                choices: {
                    status: STATUS_VALUES,
                    people_type: PEOPLE_TYPE_VALUES,
                    conscription: CONSCRIPTION_VALUES
                },
                filter: {
                    status: ["قطعی", "منتظر قرعه کشی", "شرکت کرده"],
                    people_type: [...(this.$parent.program.type === 'mashhad' ? ['دانشجو شریف'] : [])],
                    gender: ['مرد',],
                    coupling: [],
                    passport: [],
                    conscription: [],
                    numberOfPayments: [],
                    level: [],
                    year: [],
                    ..._.reduce(this.$parent.program.questions, (obj, question) => {
                        obj[question.title] = [];
                        return obj;
                    }, {})
                },
                STATUS_CHOICES: STATUS_CHOICES,
                new_status: 'default',
                status: 'default',
                question_id: null,
                yes: null,
                chances: 0,
                newMessageText: '',
                send_sms: false,

            }
        },
        created() {
            // this.constructNewRegistration();
            // this.$parent.$on('fetched', this.constructNewRegistration);
            this.fetchData()
        },
        methods: {
            fetchData() {
                this.fetchStatus = 'fetching'
                HTTP.get('manage/' + this.$route.params.program_id + '/registrations/?format=json').then(resp => {
                    console.log(resp.data);
                    this.registrations = resp.data;
                    this.fetchStatus = 'fetched'
                }).catch(error => {
                    this.fetchStatus = 'error'
                })
            },
            excel() {
                exportExcel(this.filtered)
            },
            changeStatus() {
                this.status = 'sending';
                HTTP.post('manage/' + this.$route.params.program_id + '/change_status/', {
                    status: this.new_status,
                    ids: _.map(this.filtered, 'ردیف')
                }).then(resp => {
                    this.registrations = resp.data;
                    this.status = 'default'
                }).catch(error => {
                    this.status = 'error'
                })
            },
            draw() {
                this.status = 'sending';
                HTTP.post('manage/' + this.$route.params.program_id + '/draw/', {
                    chances: this.chances,
                    ids: _.map(this.filtered, 'ردیف')
                }).then(resp => {
                    this.registrations = resp.data;
                    this.status = 'default'
                }).catch(error => {
                    this.status = 'error'
                })
            },
            send() {
                this.status = 'sending';
                HTTP.post('manage/' + this.$route.params.program_id + '/bulk_message/', {
                    text: this.newMessageText,
                    send_sms: this.send_sms,
                    ids: _.map(this.filtered, 'ردیف')
                }).then(resp => {
                    this.status = 'default'
                    this.newMessageText = ''
                    this.send_sms = false;
                }).catch(error => {
                    this.status = 'error'
                })
            },
            changeAnswer() {
                this.status = 'sending';
                HTTP.post('manage/' + this.$route.params.program_id + '/change_answer/', {
                    question_id: this.question_id,
                    yes: this.yes,
                    ids: _.map(this.filtered, 'ردیف')
                }).then(resp => {
                    this.registrations = resp.data;
                    this.status = 'default'
                }).catch(error => {
                    this.status = 'error'
                })
            },
        },
        computed: {
            ...mapGetters(['getUser', 'isAuthenticated', 'isProfileLoaded', 'isProfileCompleted', 'isMarried']),
            years() {
                const y = this.$parent.program.year;
                if (y == undefined) return [];
                let year = Number(y.toString().slice(-2))
                return [...Array(year + 1).keys()].slice(year - 4)
            },
            questions() {
                return _.reduce(this.$parent.program.questions, (obj, item) => {
                    obj[item.id] = item.title
                    return obj
                }, {})
            },
            flat() {
                return flatRegistrations(this.registrations, this.$parent.program.questions)
            },
            filtered() {
                return _.filter(this.flat, item => {
                    if (this.filter.status.length > 0) {
                        if (!_.includes(this.filter.status, item['وضعیت'])) {
                            return false;
                        }
                    }
                    if (this.filter.level.length > 0) {
                        if (!_.includes(this.filter.level, item['مقطع'])) {
                            return false;
                        }
                    }
                    if (this.filter.year.length > 0) {
                        if (!_.includes(this.filter.year, item['سال ورود'])) {
                            return false;
                        }
                    }
                    if (this.filter.conscription.length > 0) {
                        if (!_.includes(this.filter.conscription, item['وضعیت نظام وظیفه'])) {
                            return false;
                        }
                    }
                    if (this.filter.numberOfPayments.length > 0) {
                        if (!_.includes(this.filter.numberOfPayments, item['تعداد قسط'])) {
                            return false;
                        }
                    }
                    if (this.filter.coupling.length > 0) {
                        if (!_.includes(this.filter.coupling, item['متاهلی'])) {
                            return false;
                        }
                    }
                    if (this.filter.passport.length > 0) {
                        if (!_.includes(this.filter.passport, item['وضعیت گذرنامه'])) {
                            return false;
                        }
                    }
                    if (this.filter.gender.length > 0) {
                        if (!_.includes(this.filter.gender, item['جنسیت'])) {
                            return false;
                        }
                    }
                    if (this.filter.people_type.length > 0) {
                        if (!_.includes(this.filter.people_type, item['وضعیت تحصیل'])) {
                            return false;
                        }
                    }
                    for (let question of this.$parent.program.questions) {
                        if (this.filter[question.title] && this.filter[question.title].length > 0) {
                            if (!_.includes(this.filter[question.title], item[question.title])) {
                                return false;
                            }
                        }
                    }
                    return true
                })
            },
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

    .form-check-label {
        margin-left: 3px;
        padding-right: 5px !important;
    }

    .form-check.form-check-inline {
        margin-left: 0;
        margin-right: 7px;
    }

    .form-check-inline .form-check-input {
        margin-right: 0;
    }

    .icons a {
        margin-right: 5px;
    }
</style>