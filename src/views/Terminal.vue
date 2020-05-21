<template>
    <div class="container">
        <b-card>
            <div v-if="!!fixedExpense">
                <div v-show="fixedExpense.image_url">
                    <img :src="fixedExpense.image_url">
                </div>
                <h1>{{fixedExpense.expense_name}}</h1>
            </div>
            <h1>
                {{global_name}}
            </h1>
            <b-form @submit="onSubmit" ref="mainForm" v-if="status!=='success'">
                <b-form-group :label="field_title" v-if="!fixedExpense">
                    <b-form-select :options="expenses" text-field="expense_name"
                                   v-model="chosenEspenseId" value-field="id"></b-form-select>
                </b-form-group>
                <b-form-group :label="flag_title" v-if="has_flag">
                    <b-form-checkbox v-model="flag_value">.</b-form-checkbox>
                </b-form-group>
                <b-form-group label="مبلغ (تومان):">
                    <b-form-input :disabled="amountSet" placeholder="مبلغ به تومان" required type="number"
                                  v-model="amount"></b-form-input>
                </b-form-group>
                <b-form-group label="نام و نام خانوادگی (اختیاری):" v-if="status!=='auto_send'">
                    <b-form-input type="text" v-model="optional_name"></b-form-input>
                </b-form-group>
                <b-form-group label="شمارهٔ تلفن (اختیاری):" v-if="status!=='auto_send'">
                    <b-form-input type="number" v-model="optional_mobile"></b-form-input>
                </b-form-group>

                <b-button
                        :disabled="status!=='default' || (!chosenEspenseId && !fixedExpense ) || !amount"
                        type="submit"
                        variant="success"
                >
                    <span v-show="status==='default'">پرداخت</span>
                    <span v-show="status==='sending'">در حال انجام</span>
                    <span v-show="status==='auto_send'">درحال انتقال به درگاه پرداخت</span>
                </b-button>
            </b-form>
            <form
                    action="https://bpm.shaparak.ir/pgwchannel/startpay.mellat"
                    method="POST"
                    ref="hiddenForm"
            >
                <input :value="refId" name="RefId" ref="refref" type="hidden"/>
                <input style="display: none;" type="submit" value="go"/>
            </form>
        </b-card>
    </div>
</template>

<script>
    import {HTTP} from "@/utils";
    import _ from "lodash";

    export default {
        name: "Home",
        data() {
            return {
                expenses: [],
                field_title: "مورد مصرف:",
                global_name: "",
                chosenEspenseId: null,
                amount: "",
                optional_name: "",
                optional_mobile: "",
                status: "default",
                refId: "",
                amountSet: false,
                flag_title: false,
                has_flag: false,
                flag_value: false,
            };
        },
        created() {
            this.fetchData();
        },
        computed: {
            fixedExpense() {
                if (this.$route.params.expense_id) {
                    var expense = _.find(this.expenses, {"id": Number(this.$route.params.expense_id)});
                    this.has_flag = expense.flag_title !== null;
                    this.flag_title = expense.flag_title;
                    return expense;
                }
                if (this.$route.params.expense_address) {
                    var find = _.filter(this.expenses, {
                        "address": this.$route.params.expense_address
                    });
                    if (find.length === 1) {
                        this.has_flag = find[0].flag_title !== null;
                        this.flag_title = find[0].flag_title;
                        return find[0];
                    }
                    if (find.length < 1)
                        return null;

                    this.has_flag = find[0].flag_title !== null;
                    console.log(find[0])
                    this.flag_title = find[0].flag_title;

                    this.global_name = find[0].expense_name.split("-")[0];

                    var splitElement = find[0].expense_name.split("-")[1].split(':')[0];
                    this.field_title = splitElement + ":";
                    this.expenses = find.map(expense => {
                        let a = expense;
                        a.expense_name = a.expense_name.split(':')[1]
                        return a;
                    });
                }
                return null;
            },
        },
        methods: {
            fetchData() {
                HTTP.get("expenses?format=json")
                    .then(resp => {
                        this.expenses = resp.data;

                        if (this.$route.params.expense_address) {
                            let expense = _.find(this.expenses, {
                                "address": this.$route.params.expense_address
                            });

                            let amount = parseFloat(this.$route.params.amount);
                            if (amount) {
                                this.amount = amount * expense.contribution;
                                this.amountSet = true;
                                if (this.$route.params.direct) {
                                    console.log(this.$route.params.direct);
                                    this.status = "auto_send";
                                    HTTP.post("pay/terminal/start/", {
                                        amount: this.amount,
                                        expense_id: expense.id,
                                        optional_name: "",
                                        optional_mobile: "",
                                        flag: this.flag_value
                                    }).then(resp => {
                                        this.refId = resp.data;
                                        this.$refs.refref.value = resp.data;
                                        this.$refs.hiddenForm.submit();
                                    });
                                }
                            }
                        }

                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            onSubmit: function (e) {
                e.preventDefault();
                this.status = "sending";
                HTTP.post("pay/terminal/start/", {
                    amount: this.amount,
                    expense_id: this.fixedExpense ? this.fixedExpense.id : this.chosenEspenseId,
                    optional_name: this.optional_name,
                    optional_mobile: this.optional_mobile,
                    flag: this.flag_value
                }).then(resp => {
                    this.refId = resp.data;
                    this.$refs.refref.value = resp.data;
                    this.$refs.hiddenForm.submit();
                });
            }
        }
    };
</script>
