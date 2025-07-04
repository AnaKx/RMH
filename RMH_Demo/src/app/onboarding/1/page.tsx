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
import '@/globals.css';


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
  const { control, register, watch, handleSubmit, formState: { errors } } = useForm<Step1Data>({
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
    <div className='center-content'>
      <StepHeader steps={ONBOARDING_STEPS} current={1} />
      <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>
        Personal Info
      </h1>
      <p style={{ marginBottom: 24, color: '#475569' }}>
        A complete profile increases your chances of getting hired. Upload a photo, write a description, and highlight your skills.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        
      >
        <div className="form-field required">
          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            className="input-control"
            {...register('firstName', { required: 'First name is required' })}
            required
          />
          {errors.firstName && (
            <div className="error-wrapper">
              <p className="error-message">{errors.firstName.message}</p>
            </div>
          )}
        </div>

        <div className="form-field required">
          <label htmlFor='lastName'>Last name</label>
          <input
          id="lastName"
          className="input-control"
          {...register('lastName', { required: 'Last name is required' })}
          required
          style={{ width: '100%', padding: '8px'}}
          />
          {errors.lastName && (
            <div className="error-wrapper">
              <p className="error-message">{errors.lastName.message}</p>
            </div>
          )}
        </div>

        <div className="form-field required">
          <label htmlFor='displayName'>Display name</label>
          <input
          id="displayName"
          className="input-control"
          {...register('displayName', { required: 'Display name is required' })}
          required
          style={{ width: '100%', padding: '8px'}}
          />
          {errors.displayName && (
            <div className="error-wrapper">
              <p className="error-message">{errors.displayName.message}</p>
            </div>
          )}
        </div>

        <div className="form-field required">
          <label htmlFor='location'>Location</label>
          <input
          id="location"
          className="input-control"
          {...register('location', { required: 'Location is required' })}
          required
          style={{ width: '100%', padding: '8px'}}
          />
          {errors.location && (
            <div className="error-wrapper">
              <p className="error-message">{errors.location.message}</p>
            </div>
          )}
        </div>
        

        <div className="form-field">
        <label htmlFor="languages">Languages</label>
        <Controller
          name="languages"
    
          control={control} 
          rules={{ required: 'Please select at least one language' }}
          render={({ field }) => (
            <ReactSelect
              {...field}
              isMulti
              options={LANGUAGE_OPTIONS}
              onChange={(
                newValue,
                _actionMeta
              ) => {
                const selected = newValue as MultiValue<{ value: string; label: string }>;
                field.onChange(selected.map((o: { value: string; label: string }) => o.value));
              }}
              value={LANGUAGE_OPTIONS.filter(o =>
                field.value.includes(o.value)
              )}
            />
          )}
        />
        {errors.languages && (
          <div className="error-wrapper">
            <p className="error-message">{errors.languages.message}</p>
          </div>
        )}
        </div>

      <div className="form-field required">
          <label htmlFor='about'>About</label>
          <textarea
          id="about"
          className="input-control"
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
          {errors.about && (
            <div className="error-wrapper">
              <p className="error-message">{errors.about.message}</p>
            </div>
          )}
        </div>

      <div className="form-field required">
          <label htmlFor='profilePicture'>Profile Picture</label>
          <input
          id="profilePicture"
          className="input-control"
          type="file"
          accept="image/*"
          style={{ width: '100%', padding: '8px'}}
          {...register('profilePicture', {required: 'Profile picture is required'})}
          />
          {errors.profilePicture && (
            <div className="error-wrapper">
              <p className="error-message">{errors.profilePicture.message}</p>
            </div>
          )}
        </div>
      

        <button type="submit" className="button">
          Continue
        </button>
      </form>
    </div>
    </>
  );
}