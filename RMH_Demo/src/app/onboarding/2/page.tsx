'use client';
import { useForm, useFieldArray } from 'react-hook-form';
import { useWizard } from '@/lib/context';
import { useRouter } from 'next/navigation';
import { StepHeader } from '@/components/StepHeader';
import { ONBOARDING_STEPS } from '@/constants/steps';

type EducationEntry = {
  university: string;
  major: string;
  title: string;
  year: string;
};

type CertEntry = {
  name: string;
  from: string;
  year: string;
};

type Step2Data = {
  role: string;
  skills: { name: string }[];
  education: EducationEntry[];
  cert_award: CertEntry[];
};

export default function Step2() {
  const router = useRouter();
  const { control, register, handleSubmit, formState: {errors}, watch } = useForm<Step2Data>({
    defaultValues: { skills: [], education: [], cert_award: [],},
  });
  const { save } = useWizard();

const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({ control, name: 'skills' });

const skills = watch("skills");

  const {
    fields: eduFields,
    append: appendEdu,
    remove: removeEdu,
  } = useFieldArray({ control, name: 'education' });

  const {
    fields: certFields,
    append: appendCert,
    remove: removeCert,
  } = useFieldArray({ control, name: 'cert_award' });
  
  const onSubmit = (data: Step2Data) => {
    save('2', data);
    router.push('/onboarding/3');
  };

  return (
    <>
      <StepHeader steps={ONBOARDING_STEPS} current={2} />

      <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>
        Profesional Info
      </h1>
      <p style={{ marginBottom: 24, color: '#475569' }}>
        Add your background, experience, and skills to build a profile that grabs attention. People are looking for talent like yours—make it easy for them to choose you!
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ padding: '16px', maxWidth: 400, margin: '0 auto' }}
      >
        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="role">Role</label><br/>
          <input
            id="role"
            {...register('role')}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div> 

        <div style={{ marginBottom: '12px' }}>
            <h2>Skills</h2>
            <input
                type="hidden"
                {...register("skills", {
                validate: (arr) =>
                    arr.length > 0 || "You must add at least one skill",
                })}
            />
            {errors.skills && (
                <p style={{ color: "red" }}>{errors.skills.message}</p>
            )}
            {skillFields.map((field, idx) => (
                <div key={field.id} style={{ display: 'flex', gap: 8 }}>
                <input
                    placeholder="e.g. Mobile App Development"
                    {...register(`skills.${idx}.name` as const, { required: true })}
                />
                <button type="button" onClick={() => removeSkill(idx)}>
                    Remove
                </button>
                </div>
            ))}
            <button
                type="button"
                onClick={() => appendSkill({ name: '' })}
            >
                Add Skill
            </button>
        </div>

        <div style={{ marginBottom: '12px' }}>
            <h2>Education</h2>
            {eduFields.map((field, idx) => (
                <div key={field.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
                <input
                    placeholder="University Name"
                    {...register(`education.${idx}.university` as const, { required: true })}
                />
                <input
                    placeholder="Major"
                    {...register(`education.${idx}.major` as const, { required: true })}
                />
                <input
                    placeholder="Title"
                    {...register(`education.${idx}.title` as const, { required: true })}
                />
                <select {...register(`education.${idx}.year` as const, { required: true })}>
                    <option value="">Year</option>
                    {Array.from({ length: 50 }, (_, i) => 1970 + i).map(y => (
                    <option key={y} value={String(y)}>
                        {y}
                    </option>
                    ))}
                </select>
                <button type="button" onClick={() => removeEdu(idx)}>
                    Remove
                </button>
                </div>
            ))}
            <button
                type="button"
                onClick={() => appendEdu({ university: '', major: '', title: '', year: '' })}
            >
                Add Education
            </button>
        </div>

        <div style={{ marginBottom: '12px' }}>
            <h2>Certifications/Awards</h2>
            {eduFields.map((field, idx) => (
                <div key={field.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
                <input
                    placeholder="Certificate"
                    {...register(`cert_award.${idx}.name` as const, { required: true })}
                />
                <input
                    placeholder="Certified from"
                    {...register(`cert_award.${idx}.from` as const, { required: true })}
                />
                
                <select {...register(`cert_award.${idx}.year` as const, { required: true })}>
                    <option value="">Year</option>
                    {Array.from({ length: 50 }, (_, i) => 1970 + i).map(y => (
                    <option key={y} value={String(y)}>
                        {y}
                    </option>
                    ))}
                </select>
                <button type="button" onClick={() => removeEdu(idx)}>
                    Remove
                </button>
                </div>
            ))}
            <button
                type="button"
                onClick={() => appendEdu({ university: '', major: '', title: '', year: '' })}
            >
                Add Education
            </button>
        </div>
      

        <button type="submit" style={{ padding: '8px 16px' }}>
          Continue
        </button>
      </form>
    </>
  );
}