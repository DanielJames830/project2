import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
    const firstName = ref('')
    const lastName = ref('')
    const userName = ref('')
    const token = ref('')
    const email = ref('')
    const password = ref('')

    const wholeName = computed(() => firstName.value + ' ' + lastName.value)

    function setUser(fName, lName, uName, t, e, pWord) {
        firstName.value = fName ?? ''
        lastName.value = lName ?? ''
        userName.value = uName ?? ''
        token.value = t ?? ''
        email.value = e ?? ''
        password.value = pWord ?? ''
    }

    function $reset() {
        firstName.value = ''
        lastName.value = ''
        userName.value = ''
        token.value = ''
        email.value = ''
        password.value = ''
    }

    return { firstName, lastName, userName, wholeName, token, email, password, setUser, $reset }
})
