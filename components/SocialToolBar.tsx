import { Platform } from '@/types/Social';
import { Facebook, Instagram, Linkedin, Twitter,  } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import {
  IResolveParams,
} from 'reactjs-social-login'

const LoginSocialFacebook = dynamic(
  () => import('reactjs-social-login').then((mod) => mod.LoginSocialFacebook),
  { ssr: false }
);

const LoginSocialInstagram = dynamic(
  () => import('reactjs-social-login').then((mod) => mod.LoginSocialInstagram),
  { ssr: false }
);

const LoginSocialLinkedin = dynamic(
  () => import('reactjs-social-login').then((mod) => mod.LoginSocialLinkedin),
  { ssr: false }
);

const LoginSocialTwitter = dynamic(
  () => import('reactjs-social-login').then((mod) => mod.LoginSocialTwitter),
  { ssr: false }
);



const SocialToolBar = ({ error, setError}: { error?: string; setError: any;}) => {

  const [isClient, setIsClient] = useState(false);
  const [provider, setProvider] = useState('')
  const [profile, setProfile] = useState<any>()
  
  let REDIRECT_URI = typeof window !== 'undefined' && window?.location.href || '';
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // const connectSocial = async (platform: Platform) => {
  //   try {
  //     const response = await fetch(`/api/${platform.toLowerCase()}/connect`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //     });
  //     if (response.ok) {
  //       alert(`Post shared to ${platform}!`);
  //     } else {
  //       setError(`Failed to connect to ${platform}`);
  //     }
  //   } catch (err) {
  //     setError(`Failed to connect to ${platform}`);
  //   }
  // };

  const socialButton = 'p-5 hover:bg-gray-200 rounded-full border-gray-500 border-2'

  const onLoginStart = useCallback(() => {
    alert('login start')
  }, [])

  if (!isClient) {
    return null; 
  }

  return (
    <>
    <div className='flex gap-4'>
    <LoginSocialFacebook
        isOnlyGetToken
        appId={process.env.NEXT_PUBLIC_FB_APP_ID || ''}
        onLoginStart={onLoginStart}
        onResolve={({ provider, data }: IResolveParams) => {
          setProvider(provider)
          setProfile(data)
        }}
        onReject={(err) => {
          console.log(err)
        }}
      >
        <button className={socialButton} 
        // onClick={() => connectSocial('facebook')}
        ><Facebook className='w-8 h-8' /></button>
      </LoginSocialFacebook>

      <LoginSocialInstagram
           isOnlyGetToken
           client_id={process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID || ''}
           client_secret={process.env.NEXT_PUBLIC_INSTAGRAM_APP_SECRET || ''}
           redirect_uri={REDIRECT_URI}
           onLoginStart={onLoginStart}
           onResolve={({ provider, data }: IResolveParams) => {
             setProvider(provider)
             setProfile(data)
           }}
           onReject={(err: any) => {
             console.log(err)
           }}
          >
      <button className={socialButton} 
      // onClick={() => connectSocial('instagram')}
      ><Instagram className='w-8 h-8' /></button>
      </LoginSocialInstagram>

      <LoginSocialLinkedin
            isOnlyGetToken
            client_id={process.env.NEXT_PUBLIC_LINKEDIN_APP_ID || ''}
            client_secret={process.env.NEXT_PUBLIC_LINKEDIN_APP_SECRET || ''}
            redirect_uri={REDIRECT_URI}
            onLoginStart={onLoginStart}
            onResolve={({ provider, data }: IResolveParams) => {
              setProvider(provider)
              setProfile(data)
            }}
            onReject={(err: any) => {
              console.log(err)
            }}
          >
        <button className={socialButton} 
        // onClick={() => connectSocial('linkedin')}
        ><Linkedin className='w-8 h-8' /></button>
      </LoginSocialLinkedin>

      <LoginSocialTwitter
            isOnlyGetToken
            client_id={process.env.NEXT_PUBLIC_TWITTER_V2_APP_KEY || ''}
            redirect_uri={REDIRECT_URI}
            onLoginStart={onLoginStart}
            onResolve={({ provider, data }: IResolveParams) => {
              setProvider(provider)
              setProfile(data)
            }}
            onReject={(err: any) => {
              console.log(err)
            }}
          >
            <button className={socialButton} 
            // onClick={() => connectSocial('twitter')}
            ><Twitter className='w-8 h-8' /></button>
      </LoginSocialTwitter>
    </div>
    </>
)}

    export default SocialToolBar;