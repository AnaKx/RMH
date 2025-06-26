'use client';
import { useForm, useFieldArray } from 'react-hook-form';
import { useWizard } from '@/lib/context';
import { useRouter } from 'next/navigation';
import { StepHeader } from '@/components/StepHeader';
import { ONBOARDING_STEPS } from '@/constants/steps';
import '@/globals.css';

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
    save(2, data);
    router.push('/onboarding/3');
  };

  return (
    <>
    <div className='center-content'>
      <StepHeader steps={ONBOARDING_STEPS} current={2} />

      <h1 className="form-title">
        Profesional Info
      </h1>
      <p className="form-description">
        Add your background, experience, and skills to build a profile that grabs attention. People are looking for talent like yours—make it easy for them to choose you!
      </p>

      <div className="form-card">
        <form
          onSubmit={handleSubmit(onSubmit)}
        >
           <div className="form-field required">
            <label htmlFor="role">Role</label>
            <input
              id="role"
              {...register('role', { required: true })}
              className="input-control"
            />
            {errors.role && (
              <div className="error-wrapper">
                <p className="error-message">
                  Role is required
                </p>
              </div>
            )}
          </div> 

          <div className="form-field required">
              <label htmlFor="skills">Skills</label>
              <input
                  type="hidden"
                  {...register("skills", {
                  validate: (arr) =>
                      arr.length > 0 || "You must add at least one skill",
                  })}
              />
            {errors.skills && (
              <div className="error-wrapper">
                <p className="error-message">
                  At least one skill is required
                </p>
              </div>
            )}
              {skillFields.map((field, idx) => (
                  <div key={field.id} style={{ display: 'flex', gap: 8 }}>
                  <input
                      placeholder="e.g. Mobile App Development"
                      {...register(`skills.${idx}.name` as const, { required: true })}
                      className="input-control"
                  />
                  <button type="button" onClick={() => removeSkill(idx)} className="button-transparent">
                      Remove
                  </button>
                  </div>
              ))}
              <button
                  type="button"
                  onClick={() => appendSkill({ name: '' })}
                  className="button-secondary"
              >
                  Add Skill
              </button>
          </div>

          <div className="form-field required">
              <label htmlFor="education">Education</label>
              {eduFields.map((field, idx) => (
                <div key={field.id} className="form-grid-4">
                  <input
                      placeholder="University Name"
                      {...register(`education.${idx}.university` as const)}
                      className="input-control"
                  />
                  <input
                      placeholder="Major"
                      {...register(`education.${idx}.major` as const)}
                      className="input-control"
                  />
                  <input
                      placeholder="Title"
                      {...register(`education.${idx}.title` as const)}
                      className="input-control"
                  />
                  <select {...register(`education.${idx}.year` as const)} className="input-control">
                      <option value="">Year</option>
                      {Array.from({ length: 50 }, (_, i) => 1970 + i).map(y => (
                      <option key={y} value={String(y)}>
                          {y}
                      </option>
                      ))}
                  </select>
                  <div>
                    <button type="button" onClick={() => removeEdu(idx)} className="button-transparent">
                        Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                  type="button"
                  onClick={() => appendEdu({ university: '', major: '', title: '', year: '' })}
                  className="button-secondary"
              >
                  Add Education
              </button>
          </div>

          <div className="form-field required">
              <label htmlFor="cert_award">Certifications/Awards</label>
              {certFields.map((field, idx) => (
                <div key={field.id} className="form-grid-3">
                  <input
                      placeholder="Certificate"
                      {...register(`cert_award.${idx}.name` as const)}
                      className="input-control"
                  />
                  <input
                      placeholder="Certified from"
                      {...register(`cert_award.${idx}.from` as const)}
                      className="input-control"
                  />
                  
                  <select {...register(`cert_award.${idx}.year` as const)} className="input-control">
                      <option value="">Year</option>
                      {Array.from({ length: 50 }, (_, i) => 1970 + i).map(y => (
                      <option key={y} value={String(y)}>
                          {y}
                      </option>
                      ))}
                  </select>
                    <button type="button" onClick={() => removeCert(idx)} className="button-transparent"> 
                        Remove
                    </button>
                </div>
              ))}
              <button
                  type="button"
                  onClick={() => appendCert({ name: '', from: '', year: '' })}
                  className="button-secondary"
              > 
                  Add Certification
              </button>
          </div>
        

          <button type="submit" className="button">
            Continue
          </button>
        </form>
      </div>
    </div>
    </>
  );
}