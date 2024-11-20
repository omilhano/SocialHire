import { Briefcase, Calendar } from 'lucide-react';

const ExperienceForm = ({ experience, onChange, onSave, onCancel }) => {
    const handleChange = (field, value) => {
        onChange({ ...experience, [field]: value });
    };

    return (
        <div className="add-experience-form space-y-4">
            <input
                type="text"
                value={experience.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Job Title"
                className="edit-input w-full p-2 border rounded"
            />
            <input
                type="text"
                value={experience.company || ''}
                onChange={(e) => handleChange('company', e.target.value)}
                placeholder="Company"
                className="edit-input w-full p-2 border rounded"
            />
            <div className="date-inputs flex gap-4">
                <input
                    type="date"
                    value={experience.startDate || ''}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    className="edit-input flex-1 p-2 border rounded"
                />
                <input
                    type="date"
                    value={experience.endDate || ''}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    className="edit-input flex-1 p-2 border rounded"
                    disabled={experience.current}
                />
            </div>
            <label className="current-job flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={experience.current || false}
                    onChange={(e) => handleChange('current', e.target.checked)}
                    className="form-checkbox"
                />
                <span>I currently work here</span>
            </label>
            <textarea
                value={experience.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Description"
                className="edit-textarea w-full p-2 border rounded h-32 resize-none"
            />
            <div className="edit-actions flex justify-end gap-2">
                <button
                    onClick={onSave}
                    className="save-btn bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Save
                </button>
                <button
                    onClick={onCancel}
                    className="cancel-btn bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

const ExperienceList = ({ items = [] }) => {
    return (
        <div className="experience-list space-y-4">
            {items.map((exp, index) => (
                <div key={index} className="experience-item bg-white p-4 rounded-lg shadow">
                    <div className="flex gap-4">
                        <div className="experience-icon p-2 bg-gray-100 rounded-full">
                            <Briefcase size={24} className="text-gray-600" />
                        </div>
                        <div className="experience-details flex-1">
                            <h3 className="font-semibold text-lg text-gray-900">
                                {exp.title}
                            </h3>
                            <p className="company text-gray-700">
                                {exp.company}
                            </p>
                            <p className="date flex items-center gap-1 text-gray-500 text-sm">
                                <Calendar size={16} />
                                <span>
                                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                </span>
                            </p>
                            <p className="description mt-2 text-gray-600">
                                {exp.description}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
            {items.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                    No experience added yet
                </div>
            )}
        </div>
    );
};

export { ExperienceForm, ExperienceList };