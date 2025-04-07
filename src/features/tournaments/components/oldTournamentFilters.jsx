import { useState } from "react";
import { Input } from "@shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/ui/select";

export default function TournamentFilters({ filters, onFilterChange }) {
  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value });
  };

  const handleTypeChange = (value) => {
    onFilterChange({ type: value });
  };

  const handleStatusChange = (value) => {
    onFilterChange({ status: value });
  };
  
  const handleRegistrationChange = (value) => {
    onFilterChange({ registration: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-800 p-4 rounded-lg border border-gray-700">
      <div>
        <label htmlFor="search" className="block text-sm text-gray-400 mb-1">
          Search by Name
        </label>
        <Input
          id="search"
          placeholder="Search tournaments..."
          value={filters.search}
          onChange={handleSearchChange}
          className="bg-gray-700 border-gray-600 text-white focus:border-yellow-400"
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm text-gray-400 mb-1">
          Tournament Type
        </label>
        <Select defaultValue={filters.type} onValueChange={handleTypeChange}>
          <SelectTrigger id="type" className="bg-gray-700 border-gray-600 text-white focus:border-yellow-400">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600 text-white">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="0">Survival (Showtime)</SelectItem>
            <SelectItem value="1">Survival (Score)</SelectItem>
            <SelectItem value="2">Arena</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm text-gray-400 mb-1">
          Status
        </label>
        <Select defaultValue={filters.status} onValueChange={handleStatusChange}>
          <SelectTrigger id="status" className="bg-gray-700 border-gray-600 text-white focus:border-yellow-400">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600 text-white">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label htmlFor="registration" className="block text-sm text-gray-400 mb-1">
          Registration
        </label>
        <Select defaultValue={filters.registration} onValueChange={handleRegistrationChange}>
          <SelectTrigger id="registration" className="bg-gray-700 border-gray-600 text-white focus:border-yellow-400">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600 text-white">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="open">Registration Open</SelectItem>
            <SelectItem value="closed">Registration Closed</SelectItem>
            <SelectItem value="active">Active Tournaments</SelectItem>
            <SelectItem value="ended">Ended Tournaments</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 