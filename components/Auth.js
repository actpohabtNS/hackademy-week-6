import { Auth as AuthForm, Typography, Button } from '@supabase/ui'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

const Container = (props) => {
  const { user } = AuthForm.useUser()
    const router = useRouter(); 

  if (user) {
    router.reload();
    return null;
  }
  return props.children
}

export default function Auth() {
  return (
      <div className="container" style={{ width: "25vw" }}>
            <AuthForm.UserContextProvider supabaseClient={supabase}>
                <Container supabaseClient={supabase}>
                    <AuthForm supabaseClient={supabase} />
                </Container>
            </AuthForm.UserContextProvider>
      </div>
  )
}
