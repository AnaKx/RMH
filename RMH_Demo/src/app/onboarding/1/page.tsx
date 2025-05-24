'use client';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { LANGUAGE_OPTIONS } from '@/constants/languages';
import { StepHeader } from '@/components/StepHeader';
import { ONBOARDING_STEPS } from '@/constants/steps';
import dynamic from 'next/dynamic';
const ReactSelect = dynamic(() => import('react-select'), { ssr: false });
import type { MultiValue } from 'react-select';
import { useWizard } from '@/lib/context';


type Step1Data = {
  firstName: string;
  lastName: string;
  displayName: string;
  location: string;
  languages: string[];
  about: string;
  profilePicture: FileList;
};

export default function Step1() {
  const router = useRouter();
  const { control, register, watch, handleSubmit } = useForm<Step1Data>({
    defaultValues: { languages: [], about: ''},
  });

  const { save } = useWizard();

  const aboutValue = watch('about');
  const charCount = aboutValue.length;

  
  const onSubmit = (data: Step1Data) => {
    save(1, data);
    router.push('/onboarding/2');
  };

  return (
    <>
      <StepHeader steps={ONBOARDING_STEPS} current={1} />

      <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>
        Personal Info
      </h1>
      <p style={{ marginBottom: 24, color: '#475569' }}>
        A complete profile increases your chances of getting hired. Upload a photo, write a description, and highlight your skills.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ padding: '16px', maxWidth: 400, margin: '0 auto' }}
      >
        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="firstName">First name</label><br/>
          <input
            id="firstName"
            {...register('firstName')}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '12px'}}>
          <label htmlFor='lastName'>Last name</label><br/>
          <input
          id="lastName"
          {...register('lastName')}
          required
          style={{ width: '100%', padding: '8px'}}
          />
        </div>

        <div style={{ marginBottom: '12px'}}>
          <label htmlFor='displayName'>Display name</label><br/>
          <input
          id="displayName"
          {...register('displayName')}
          required
          style={{ width: '100%', padding: '8px'}}
          />
        </div>

        <div style={{ marginBottom: '12px'}}>
          <label htmlFor='location'>Location</label><br/>
          <input
          id="location"
          {...register('location')}
          required
          style={{ width: '100%', padding: '8px'}}
          />
        </div>
        

        <div style={{ marginBottom: '12px' }}>
        <label htmlFor="languages">Languages</label>
        <Controller
          name="languages"
          control={control} 
          rules={{ required: true }}
          render={({ field }) => (
            <ReactSelect
              {...field}
              isMulti
              options={LANGUAGE_OPTIONS}
              onChange={(
                newValue,
                _actionMeta
              ) => {
                // Cast incoming value to correct type
                const selected = newValue as MultiValue<{ value: string; label: string }>;
                field.onChange(selected.map((o: { value: string; label: string }) => o.value));
              }}
              value={LANGUAGE_OPTIONS.filter(o =>
                field.value.includes(o.value)
              )}
            />
          )}
        />
        </div>

      <div style={{ marginBottom: '12px'}}>
          <label htmlFor='about'>About</label><br/>
          <textarea
          id="about"
          rows={4}
          placeholder='Tell us about yourself'
            {...register('about', {
              required: 'This field is required',
              minLength: {
                value: 150,
                message: 'Please enter at least 150 characters',
              },
              maxLength: {
                value: 500,
                message: 'Maximum 500 characters allowed',
              },
            })}
          style={{ width: '100%', padding: '8px'}}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.875rem',
              color: charCount < 150 ? '#666' : '#444',
            }}
          >
            <span>At least 150 characters</span>
            <span>{charCount}/500</span>
          </div>
        </div>

      <div style={{ marginBottom: '12px'}}>
          <label htmlFor='profilePicture'>Profile Picture</label><br/>
          <input
          id="profilePicture"
          type="file"
          accept="image/*"
          style={{ width: '100%', padding: '8px'}}
          {...register('profilePicture', {required: true})}
          />
        </div>
      

        <button type="submit" className="btn btn-primary">
          Continue
        </button>
      </form>
    </>
  );
}