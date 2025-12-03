import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../components/layouts/DashboardLayout";
import { FiClock, FiDollarSign, FiMapPin } from "react-icons/fi";
import moment from "moment";

// Componente para mostrar etiquetas de tipo de trabajo y salario
const JobTags = ({ type, salary }) => (
  <div className="flex gap-2 mb-4">
    <span className="px-3 py-1 bg-[#e0f7fa] text-[#007B9E] rounded-full text-sm flex items-center">
      <FiClock className="mr-1" />
      {type === "full-time"
        ? "Tiempo Completo"
        : type === "part-time"
        ? "Medio Tiempo"
        : "Contrato"}
    </span>
    {salary && (
      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center">
        <FiDollarSign className="mr-1" />
        {salary}
      </span>
    )}
  </div>
);

// Componente para mostrar una publicación individual
const JobCard = ({ job, onApply }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col justify-between">
    <div>
      <h2 className="text-xl font-semibold mb-2 text-[#007B9E]">{job.title}</h2>
      <p className="text-gray-600 mb-1">{job.company_name}</p>
      <p className="text-gray-500 mb-2 text-sm">{job.candidate_required_location}</p>

      <p className="text-gray-700 mb-4 line-clamp-3 bg-[#e0f7fa] px-2 py-1 rounded">
        {(job.description ?? "").replace(/<[^>]+>/g, "").slice(0, 200)}...
        
      </p>
     <p
 
></p>

      <JobTags type={job.job_type} salary={job.salary} />
    </div>

    <button
      onClick={() => onApply(job.url)}
      className="mt-4 bg-[#00B8D9] text-white py-2 rounded-lg hover:bg-[#0093b3] transition-colors font-semibold cursor-pointer"
    >
      Aplicar
    </button>
  </div>
);

// Componente principal
const RemoteJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/remote-jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data.jobs || []))
      .catch((err) => setError("Error al cargar los trabajos"))
      .finally(() => setLoading(false));
  }, []);
console.log(jobs);
  const handleApply = (url) => window.open(url, "_blank");

  if (loading)
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#00B8D9]"></div>
        </div>
      </DashboardLayout>
    );

  if (error)
    return (
      <DashboardLayout>
        <div className="text-red-500 text-center p-4">{error}</div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Banner Remotive */}
        <div className="bg-[#00B8D9] text-white rounded-lg p-4 mb-6 text-center font-semibold">
          ⚡ Trabajos obtenidos desde <span className="font-bold">Remotive</span>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-[#007B9E] text-center">
          Empleos Remotos
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No se encontraron trabajos
            </p>
          ) : (
            jobs.map((job) => (
              <JobCard key={job.id} job={job} onApply={handleApply} />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export { RemoteJobs };
