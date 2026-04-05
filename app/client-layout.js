'use client';

import NavigationBar from '@/components/NavigationMenu';
import FullPageLoader from '@/components/pages/loader';
import LockPage from '@/components/pages/lock-page';
import useAuthStore from '@/store/authStore';
import React, { useEffect } from 'react'

function ClientLayout({ children }) {
    const { isAuthenticated, authLoading, checkAuth } = useAuthStore();
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);
    // if (authLoading) {
    //     return <FullPageLoader />;
    // }
    if (!isAuthenticated) {
        return <LockPage />
    }
    return (
        <div>
            <NavigationBar />
            <div className='px-2 pt-18 h-dvh'>{children}</div>
        </div>
    )
}

export default ClientLayout