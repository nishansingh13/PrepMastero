"use client"
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const getMSQuestions = async() => {
    try {
      setLoading(true);
      const res = await axios.get("/api/microsoft/getData");
      setProblems(res.data.data);
      setFilteredProblems(res.data.data);
    } catch (error) {
      console.error("Error fetching problems:", error);
    } finally {
      setLoading(false);
    }
  }

  const updateProblemStatus = async (problemId, newStatus) => {
    if (!problemId) {
      console.error("Problem ID is required");
      return;
    }
    
    try {
      // Update in backend
      await axios.put(`/api/microsoft/updateStatus/${problemId}`, { status: newStatus });
      
      // Update local state
      const updatedProblems = problems.map(problem => 
        problem._id === problemId ? { ...problem, status: newStatus } : problem
      );
      setProblems(updatedProblems);
      filterProblems(updatedProblems, searchTerm, difficultyFilter, statusFilter);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const updateProblemSolved = async (problemId, isSolved) => {
    if (!problemId) {
      console.error("Problem ID is required");
      return;
    }
    
    // Optimistic UI update - update local state immediately
    const updatedProblems = problems.map(problem => 
      problem._id === problemId ? { ...problem, solved: isSolved } : problem
    );
    setProblems(updatedProblems);
    filterProblems(updatedProblems, searchTerm, difficultyFilter, statusFilter);
    
    try {
      // Update in backend
      await axios.put(`/api/microsoft/updateStatus/${problemId}`, { solved: isSolved });
    } catch (error) {
      console.error("Error updating solved status:", error);
      
      // Revert the optimistic update if backend fails
      const revertedProblems = problems.map(problem => 
        problem._id === problemId ? { ...problem, solved: !isSolved } : problem
      );
      setProblems(revertedProblems);
      filterProblems(revertedProblems, searchTerm, difficultyFilter, statusFilter);
      
      // Show error message to user
      alert("Failed to update problem status. Please try again.");
    }
  };

  const filterProblems = (problemList, search, difficulty, status) => {
    let filtered = problemList;

    if (search) {
      filtered = filtered.filter(problem =>
        (problem?.Title && problem.Title.toLowerCase().includes(search.toLowerCase())) ||
        (problem?.Topics && problem.Topics.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (difficulty !== "All") {
      filtered = filtered.filter(problem => problem?.Difficulty === difficulty);
    }

    if (status !== "All") {
      filtered = filtered.filter(problem => {
        const problemStatus = problem?.status || "Not Solved";
        return problemStatus === status;
      });
    }

    setFilteredProblems(filtered);
  };

  useEffect(() => {
    getMSQuestions();
  }, []);

  useEffect(() => {
    filterProblems(problems, searchTerm, difficultyFilter, statusFilter);
  }, [searchTerm, difficultyFilter, statusFilter, problems]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "EASY": return "text-green-600 bg-green-100";
      case "MEDIUM": return "text-yellow-600 bg-yellow-100";
      case "HARD": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "easily done": return "text-green-700 bg-green-100 border-green-200";
      case "need revisit": return "text-yellow-700 bg-yellow-100 border-yellow-200";
      case "very hard": return "text-red-700 bg-red-100 border-red-200";
      case "Not Solved": return "text-gray-700 bg-gray-100 border-gray-200";
      default: return "text-gray-700 bg-gray-100 border-gray-200";
    }
  };

  const getProgressStats = () => {
    const total = problems.length;
    const solved = problems.filter(p => p?.solved === true).length;
    const attempted = problems.filter(p => p?.status === "need revisit").length;
    const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;
    
    return { total, solved, attempted, percentage };
  };

  const stats = getProgressStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading problems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">PrepMastero</h1>
          <p className="text-lg text-gray-600">Master Your Coding Interview Preparation</p>
          
          {/* Navigation */}
          <div className="mt-4 flex justify-center space-x-4">
            <span className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
              Microsoft Questions (Current)
            </span>
            <Link 
              href="/sde"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Striver's SDE Sheet
            </Link>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <h3 className="text-sm font-medium text-gray-600">Total Problems</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-600">Solved</h3>
            <p className="text-3xl font-bold text-green-600">{stats.solved}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <h3 className="text-sm font-medium text-gray-600">Need Revisit</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.attempted}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <h3 className="text-sm font-medium text-gray-600">Progress</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.percentage}%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm text-gray-500">{stats.solved}/{stats.total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${stats.percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Problems</label>
              <input
                type="text"
                placeholder="Search by title or topic..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
              >
                <option value="All">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Not Solved">Not Solved</option>
                <option value="easily done">Easily Done</option>
                <option value="need revisit">Need Revisit</option>
                <option value="very hard">Very Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Problems List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              Problems ({filteredProblems.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredProblems.map((problem, index) => (
              <div key={problem._id || index} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Checkbox for solved status */}
                    <div className="flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={problem?.solved === true}
                        onChange={(e) => updateProblemSolved(problem?._id, e.target.checked)}
                        className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                    </div>

                    {/* Problem Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {problem?.Title}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(problem?.Difficulty)}`}>
                          {problem?.Difficulty === 'EASY' ? 'Easy' : 
                           problem?.Difficulty === 'MEDIUM' ? 'Medium' : 
                           problem?.Difficulty === 'HARD' ? 'Hard' : 
                           problem?.Difficulty || 'Unknown'}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{problem?.Topics || 'No topics specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Status Dropdown */}
                    <select
                      value={problem?.status || "Not Solved"}
                      onChange={(e) => updateProblemStatus(problem?._id, e.target.value)}
                      className={`px-3 py-1 border rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 ${getStatusColor(problem?.status || "Not Solved")}`}
                    >
                      <option value="Not Solved">Not Solved</option>
                      <option value="easily done">Easily Done</option>
                      <option value="need revisit">Need Revisit</option>
                      <option value="very hard">Very Hard</option>
                    </select>

                    {/* Link Button */}
                    {problem?.Link && (
                      <a
                        href={problem.Link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 border border-indigo-300 text-sm font-medium rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Solve
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProblems.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.94-6.02 2.47M3 12a9 9 0 1118 0v3.75a1.25 1.25 0 01-2.5 0V12a6.5 6.5 0 00-13 0v3.75a1.25 1.25 0 01-2.5 0V12z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No problems found</h3>
              <p className="text-gray-500">Try adjusting your search filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
