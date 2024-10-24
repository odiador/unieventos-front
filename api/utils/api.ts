const executeRequest = async (uri: string, options: RequestInit) => {
    let data;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${uri}`, options);
        data = await res.json();
        return { status: res.status, data };
    } catch (e) {
        return { status: 500, data };
    }
}

const validateMail = (email: string) => {
    return executeRequest(`/api/auth/validateMail?mail=${encodeURIComponent(email)}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
        }
    )
}
const checkUser = (token: string) => {
    return executeRequest(`/api/auth/checkUser`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
            credentials: 'include',
        }
    )
}

function login(data: string) {
    return executeRequest("/api/auth/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: data
        })
}


function activate(values: { email: string; code: string; }) {
    return executeRequest("/api/auth/activation/activate",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values)
        })
}
function sendActivation(email: string) {
    return executeRequest(`/api/auth/activation/send?email=${encodeURIComponent(email)}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
        })
}


function signup(values: { email: string; password: string; name: string; cedula: string; phone: string; adress: string; }) {
    return executeRequest("/api/auth/create",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values)
        })
}

export { validateMail, login, signup, activate, sendActivation, checkUser };
