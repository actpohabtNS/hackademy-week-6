import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import Avatar from './Avatar'

export default function Account({ session }) {
  const [loading, setLoading] = useState(true)
  const [phone, setPhone] = useState(null)
  const [first_name, setFirstname] = useState(null)
  const [last_name, setLastname] = useState(null)
  const [country, setCountry] = useState(null)
  const [city, setCity] = useState(null)
  const [doc_url, setDocUrl] = useState(null)

  useEffect(() => {
    getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`phone, first_name, last_name, country, city, doc_url, created_at`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (!data.created_at) {
        let { error } = await supabase.from('profiles').upsert({ id: user.id, created_at: user.created_at }, {
            returning: 'minimal', // Don't return the value after inserting
        })
    
          if (error) {
            throw error
          }
      }

      if (data) {
        setPhone(data.phone)
        setFirstname(data.first_name)
        setLastname(data.last_name)
        setCountry(data.country)
        setCity(data.city)
        setDocUrl(data.doc_url)
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({ phone, first_name, last_name, country, city, doc_url }) {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      const updates = {
        id: user.id,
        phone,
        first_name,
        last_name,
        country,
        city,
        doc_url,
        updated_at: new Date(),
      }

      let { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      })

      if (error) {
        throw error
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-widget">
        <Avatar
            url={doc_url}
            size={150}
            onUpload={(url) => {
                setDocUrl(url)
            }}
        />
        <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="text" value={session.user.email} disabled />
        </div>
        <div>
            <label htmlFor="phone">Phone number</label>
            <input
            id="phone"
            type="number"
            value={phone || ''}
            onChange={(e) => setPhone(e.target.value)}
            />
        </div>
        <div>
            <label htmlFor="firstname">First name</label>
            <input
            id="firstname"
            type="text"
            value={first_name || ''}
            onChange={(e) => setFirstname(e.target.value)}
            />
        </div>
        <div>
            <label htmlFor="lastname">Last name</label>
            <input
                id="lastname"
                type="text"
                value={last_name || ''}
                onChange={e => setLastname(e.target.value)}
            />
        </div>
        <div>
            <label htmlFor="country">Country</label>
            <input
            id="country"
            type="text"
            value={country || ''}
            onChange={(e) => setCountry(e.target.value)}
            />
        </div>
        <div>
            <label htmlFor="city">City</label>
            <input
            id="city"
            type="text"
            value={city || ''}
            onChange={(e) => setCity(e.target.value)}
            />
        </div>

        <div>
            <button
            className="button block primary"
            onClick={() => updateProfile({ phone, first_name, last_name, country, city, doc_url })}
            disabled={loading}
            >
            {loading ? 'Loading ...' : 'Update'}
            </button>
        </div>

        <div>
            <button className="button block" onClick={() => supabase.auth.signOut()}>
            Sign Out
            </button>
        </div>
    </div>
  )
}
