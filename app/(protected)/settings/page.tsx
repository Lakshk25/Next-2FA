import { auth } from '@/auth'
import React from 'react'

const SettingsPage = async () => {
  const session = await auth();
  return (
    <h1>{JSON.stringify(session)}</h1>
  )
}

export default SettingsPage