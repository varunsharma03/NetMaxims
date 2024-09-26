import React, { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  role: z.array(z.string()).min(1, 'At least one role must be selected'),
  email: z.array(z.string()).min(1, 'At least one email must be selected'),
  warehouse: z.array(z.string()).min(1, 'At least one warehouse must be selected'),
});

const MultiSelectDropdown = ({ options, selectedValues, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); 

  const handleToggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleChange = (value) => {
    onChange(selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value]);
  };

  const handleRemove = (value) => {
    onChange(selectedValues.filter((v) => v !== value));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative py-4" ref={dropdownRef}>
      <div
        className="border rounded p-2 mb-2 cursor-pointer justify-between flex"
        onClick={handleToggleDropdown}
      >
        <div className='absolute top-[18px] text-[10px] text-slate-600'>Role</div>
        <p className='text-sm text-slate-500 mt-3'>
          {selectedValues.length > 0
            ? selectedValues.join(', ')
            : 'Select'}
        </p>
        <span className='mr-2'>▼</span>
      </div>
      {isOpen && (
        <div className="absolute right-0 top-10 border rounded bg-white shadow-lg z-10">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleChange(option.value)}
              className={`p-2 cursor-pointer hover:bg-gray-200 ${selectedValues.includes(option.value) ? 'font-bold' : ''}`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-wrap mt-2">
        {selectedValues.map((value) => (
          <div key={value} className="flex items-center bg-gray-200 rounded px-2 py-1 mr-2 mb-2">
            {value}
            <button
              type="button"
              onClick={() => handleRemove(value)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const EmailSelector = ({ options, selectedValues, onChange }) => {
  const handleChange = (value) => {
    onChange(selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value]);
  };

  return (
    <div className="mb-4 relative">
      <div className='absolute top-[2px] left-[7px] text-[10px] text-slate-600'>Email Address *</div>
      <div className="border pt-4 p-2 rounded mb-2 flex flex-wrap">
        {options.map((option) => (
          <div
            key={option.value}
            onClick={() => handleChange(option.value)}
            className={`p-2 flex gap-2 justify-between cursor-pointer mr-2 mb-2 rounded-full border transition-colors 
                        ${selectedValues.includes(option.value) ? 'bg-gray-300 border-blue-500' : ' border-gray-300'}`}
          >
            <p className='text-[10px] font-thin '>{option.label}</p>
            <p className='text-[9px] font-thin '>X</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const MyForm = () => {
  const options = [
    { value: 'Warehouse manager', label: 'Warehouse manager' },
    { value: 'Employee', label: 'Employee' },
    { value: 'Company Manager', label: 'Company Manager' },
    { value: 'Date', label: 'Date' },
  ];

  const emails = [
    { value: 'varun1291@gmail.com', label: 'varun1291@gmail.com' },
    { value: 'varun1211@gmail.com', label: 'varun1211@gmail.com' },
  ];

  const warehouse = [
    { value: 'WareHouse1', label: 'WareHouse1' },
    { value: 'WareHouse2', label: 'WareHouse2' },
  ];

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema), 
    defaultValues: {
      role: [], 
      email: [],
      warehouse: []
    },
  });

  const onSubmit = (data) => {
    console.log(data)
    const a = [data.role,...data.email,...data.warehouse];
    window.alert(a)
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      <Controller
        name="role"
        control={control}
        render={({ field: { onChange, value } }) => (
          <MultiSelectDropdown
            options={options}
            selectedValues={value}
            onChange={onChange}
          />
        )}
      />
      {errors.role && <p className="text-red-500">{errors.role.message}</p>}

      <Controller
        name="email"
        control={control}
        render={({ field: { onChange, value } }) => (
          <EmailSelector
            options={emails}
            selectedValues={value}
            onChange={onChange}
          />
        )}
      />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}

      <Controller
        name="warehouse"
        control={control}
        render={({ field: { onChange, value } }) => (
          <EmailSelector
            options={warehouse}
            selectedValues={value}
            onChange={onChange}
          />
        )}
      />
      {errors.warehouse && <p className="text-red-500">{errors.warehouse.message}</p>}

      <button type="submit" className="bg-slate-900 text-md text-white px-4 py-2 rounded hover:bg-blue-600 rounded-lg mt-3">
        Invite
      </button>
    </form>
  );
};

const App = () => {
  return (
    <div className='flex justify-center items-center h-[100vh] bg-slate-400'>
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl ">
        <h1 className="text-2xl font-bold mb-4 ml-4">Add team</h1>
        <MyForm />
      </div>
    </div>
  );
};

export default App;
