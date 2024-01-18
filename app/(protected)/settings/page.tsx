import { auth, signOut } from '@/auth'
import React from 'react'

const SettingsPage = async () => {
  const session = await auth();
  return (
    <div>
    <h1>{JSON.stringify(session)}</h1>
    <form action={async () => {
      "use server";
      await signOut();
    }}>
      <button type='submit'>Sign Out</button>
    </form>
    </div>
  )
}

export default SettingsPage