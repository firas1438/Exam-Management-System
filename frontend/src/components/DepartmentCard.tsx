import React from 'react';

interface DepartmentCardProps {
  imageSrc: string;
  title: string;
  imageAlt?: string; // Optional, for accessibility
  imageClassName?: string; // Optional, for custom image positioning
  status?:any,
  onClick?: () => void;
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({
  imageSrc,
  title,
  imageClassName = "absolute w-40 h-40 mb-14 -right-14 -bottom-16",
  status,
  onClick
}) => {
  return (
    <div onClick={onClick} className="w-full min-w-[300px] sm:w-1/2 md:w-1/3 lg:w-[23%] p-8 overflow-hidden bg-white shadow-lg rounded-2xl transform hover:scale-105 transition-transform duration-300 cursor-pointer">
      <img
        alt="department"
        src={imageSrc}
        className={imageClassName}
      />
      <div className="w-4/6">
        <p className="mb-4 text-lg font-medium text-gray-800">
          {title}
        </p>
        { status && (
          <p className="text-xs text-gray-500 flex items-center">
            Status de validation:
            <img
              src={status?.not_validated_count>=0 ?  "/notvalidated.png" : "/validated.png" }
              alt="status icon"
              className="ml-2 w-4 h-4"
            />
          </p>
        )}
      </div>
    </div>
  );
};

export default DepartmentCard;