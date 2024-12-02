import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useRegisterNewUserMutation } from "../features/users/usersApiSlice"

const USER_REGEX = /^[A-z0-9]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/
const NAME_REGEX = /^[A-z]{2,20}$/

const Register = () => {
    const [registerNewUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRegisterNewUserMutation()

    const navigate = useNavigate()

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [validFirstName, setValidFirstName] = useState(false)
    const [validLastName, setValidLastName] = useState(false)
    const [username, setUsername] = useState('')
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [roles, setRoles] = useState(["User"])

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        setValidFirstName(NAME_REGEX.test(firstName))
    }, [firstName])

    useEffect(() => {
        setValidLastName(NAME_REGEX.test(lastName))
    }, [lastName])
    
    
    useEffect(() => {
        if (isSuccess) {
            setUsername('')
            setPassword('')
            setRoles([])
            navigate('/login')
        }
    }, [isSuccess, navigate])

    const onFirstnameChanged = e => setFirstName(e.target.value)
    const onLastnameChanged = e => setLastName(e.target.value)
    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)
    

    const canSave = [roles.length, validUsername, validPassword, validFirstName, validLastName].every(Boolean) && !isLoading

    const onSaveUserClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            try {
                const fullname = `${firstName} ${lastName}`.trim();
                await registerNewUser({ fullname, username, password, roles });
              } catch (err) {
                console.error('Error creating user:', err);
              }
        }
    }

    const errClass = isError ? "errmsg" : "offscreen"
    const validUserClass = !validUsername ? 'form__input--incomplete' : 'form__input--complete'
    const validPwdClass = !validPassword ? 'form__input--incomplete' : 'form__input--complete'
    const validFirstnameClass = !validFirstName ? 'form__input--incomplete' : 'form__input--complete'
    const validLastnameClass = !validLastName ? 'form__input--incomplete' : 'form__input--complete'

    const content = (
        <>
            <main className="login">
            <h1>Create an Account</h1>
            <p className={errClass}>{error?.data?.message}</p>

            <form className="register-form" onSubmit={onSaveUserClicked}>
            <label className="form__label" htmlFor="firstname">
                    First Name:</label>
                <input
                    className={`form__input ${validFirstnameClass}`}
                    id="firstname"
                    name="firstname"
                    type="text"
                    autoComplete="off"
                    value={firstName}
                    onChange={onFirstnameChanged}
                />
                <label className="form__label" htmlFor="lastname">
                    Last Name:</label>
                <input
                    className={`form__input ${validLastnameClass}`}
                    id="lastname"
                    name="lastname"
                    type="text"
                    autoComplete="off"
                    value={lastName}
                    onChange={onLastnameChanged}
                />
                <label className="form__label" htmlFor="username">
                    Username: <span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="off"
                    value={username}
                    onChange={onUsernameChanged}
                />

                <label className="form__label" htmlFor="password">
                    Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
                <input
                    className={`form__input ${validPwdClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />
                <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            disabled={!canSave}
                        >
                            💾
                        </button>
                    </div>

            </form>
            </main>
        </>
    )

    return content
}
export default Register
