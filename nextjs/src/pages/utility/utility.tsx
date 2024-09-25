import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';

export const checkAuth: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false
            },
        };
    }

    return {
        props: { session }
    }
};

export const checkLoginRegisterAuth: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (session) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            },
        };
    }
    
    return {
        props: { session }
    }
};