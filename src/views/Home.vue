<template>
    <div class="container">
        <b-card>
            <b-card-title>
                برنامه‌های هیأت
            </b-card-title>

            <div class="well">

                <b-table :fields="fields" :items="programs" bordered hover outlined striped>
                    <template v-slot:cell(title)="data">
                        <span v-html="data.value"/>
                    </template>
                    <template v-slot:cell(status)="data">
                        <span v-html="data.value"/>
                    </template>
                </b-table>
            </div>
        </b-card>
    </div>
</template>

<script>
    import {HTTP} from '@/utils'
    import Vue from 'vue'
    import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue'
    import VueQrcode from '@chenfengyuan/vue-qrcode';
    import {mapGetters} from "vuex";

    Vue.component("qrcode", VueQrcode);

    Vue.use(BootstrapVue);
    Vue.use(BootstrapVueIcons);


    export default {
        name: 'Home',
        data() {
            return {
                programs: [],
                qrcode: "",
                fields: [
                    {key: 'title', label: 'عنوان برنامه'},
                    {key: 'program_interval', label: 'زمان برنامه'},
                    {key: 'register_interval', label: 'زمان ثبت‌نام'},
                    {key: 'status', label: 'وضعیت'},
                ],
            }
        },
        created() {
            this.fetchData()
        },

        watch: {
            '$route': 'fetchData'
        },

        methods: {
            fetchData() {
                HTTP.get('programs/?format=json')
                    .then((resp) => {
                        let programs = resp.data;
                        programs.map(program => {
                            program.title = `<a href="/program/${program.id}">${program.title}</a>`;
                            if (program.status != null)
                                program.status += `&nbsp;<a href="/help/status"><sub>(راهنما)</sub></a>`;
                            return program
                        });
			programs.reverse();
                        this.programs = programs;
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            },

            make_qr_code(user) {
                let dict = {
                    "0": "9",
                    "1": "8",
                    "2": "7",
                    "3": "6",
                    "4": "5",
                    "5": "4",
                    "6": "3",
                    "7": "2",
                    "8": "1",
                    "9": "0"
                };
                let username = user.username;
                let mobile = user.profile.mobile;

                if (username === null)
                    return "0000000000";
                if (mobile === null)
                    return username;
                if (mobile.length !== 11 || username.length !== 10)
                    return username;

                let res = "";
                for (let i = 0; i < 10; i++) {
                    res += dict[mobile.charAt(10 - i)];
                    res += dict[username.charAt(i)];
                }
                res += mobile.charAt(0);

                return res
            }
        },
        computed: {
            ...mapGetters(['getUser', 'isAuthenticated', 'isProfileLoaded', 'isManager'])
        }

    }
</script>
