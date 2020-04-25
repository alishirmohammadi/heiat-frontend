<template>
    <div class="container">
        <b-card>
            <h2 v-if="fixed">
                {{fix_expense_name}}
            </h2>
            <b-form @submit="onSubmit" v-if="status!=='success'">
                <b-form-group label="مورد مصرف:" v-if="!fixed">
                    <b-form-select :options="expenses" v-model="expense_id"/>
                </b-form-group>
                <b-form-group label="مبلغ (به تومان):">
                    <b-form-input placeholder="مبلغ به تومان"
                                  required
                                  type="number"
                                  v-model="amount">
                    </b-form-input>
                </b-form-group>
                <b-form-group label="نام و نام خانوادگی (اختیاری):">
                    <b-form-input type="text"
                                  v-model="optional_name">
                    </b-form-input>
                </b-form-group>
                <b-form-group label="شمارهٔ تلفن (اختیاری):">
                    <b-form-input type="number"
                                  v-model="optional_mobile">
                    </b-form-input>
                </b-form-group>

                <b-button :disabled="status==='sending' || !expense_id || !amount" type="submit" variant="success">
                    <span v-show="status!=='sending'">پرداخت</span>
                    <span v-show="status==='sending'">در حال انجام</span>
                </b-button>
            </b-form>
            <form action="https://bpm.shaparak.ir/pgwchannel/startpay.mellat" method="POST" ref="hiddenForm">
                <input :value="refId" name="RefId" ref="refref" type="hidden">
                <input style="display: none;" type="submit" value="go">
            </form>
        </b-card>
    </div>
</template>

<script>
    import {HTTP} from '@/utils'
    import _ from 'lodash'

    export default {
        name: 'Home',
        data() {
            return {
                expenses: [],
                expenses_by_address: {},
                expense_id: null,
                expense_address: null,
                fixed: false,
                fix_expense_name: '',
                amount: '',
                optional_name: '',
                optional_mobile: '',
                status: 'default',
                refId: ''
            }
        },
        created() {
            if (this.$route.params.expense_id) {
                this.expense_id = this.$route.params.expense_id
                this.fixed = true
            } else if (this.$route.params.expense_address) {
                this.expense_address = this.$route.params.expense_address
                this.fixed = true
            }
            this.fetchData()
        },

        methods: {
            fetchData() {
                HTTP.get('expenses?format=json')
                    .then((resp) => {
                        console.log(this.expense_address)
                        this.expenses = _.mapValues(_.keyBy(resp.data, 'id'), 'expense_name')
                        this.expenses_by_address = _.keyBy(resp.data, 'address')
                        if (this.fixed) {
                            if (this.expense_id != null) {
                                this.fix_expense_name = this.expenses[this.expense_id]
                            } else if (this.expense_address != null) {
                                this.fix_expense_name = this.expenses_by_address[this.expense_address].expense_name;
                                this.expense_id = this.expenses_by_address[this.expense_address].id;
                                console.log(this.fix_expense_name)
                            }
                            if (!this.fix_expense_name) {
                                this.fixed = false
                                this.expense_id = null
                            }
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            },
            onSubmit: function (e) {
                e.preventDefault();
                this.status = 'sending';
                HTTP.post('pay/terminal/start/',
                    {
                        'amount': this.amount,
                        'expense_id': this.expense_id,
                        'optional_name': this.optional_name,
                        'optional_mobile': this.optional_mobile
                    }).then(resp => {
                    this.refId = resp.data
                    this.$refs.refref.value = resp.data
                    this.$refs.hiddenForm.submit();
                })
            },
        }
    }
</script>
