// src/pages/ClientManagement/EditClient.jsx
import React, { useState, useEffect } from "react";
import { useTheme } from "../../components/Settings/themeUtils";
// import { useToast } from "../../components/Common/CostumeTost";
import Button from "../../components/Common/Button";

const EditClient = ({ clientId, client, onClose, onSuccess }) => {
  const { themeUtils } = useTheme();
//   const toast = useToast();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    FirstName: client?.FirstName || "",
    LastName: client?.LastName || "",
    Gender: client?.Gender?.toLowerCase() || "male",
    DateOfBirth: client?.DateofBirth || "",
    PhoneNo: client?.PhoneNo || "",
    Email: client?.Email || "",
    AddressLine1: client?.AddressLine1 || "",
    AddressLine2: client?.AddressLine2 || "",
    Country: client?.Country || "",
    State: client?.State || "",
    City: client?.City || "",
    Pin: client?.Pincode || ""
  });

  // Location states
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Fetch countries on mount
  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await fetch('/api/fetch_country.php?type=countries');
      const data = await response.json();
      setCountries(data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchStates = async (country) => {
    try {
      const response = await fetch(`/api/fetch_country.php?type=states&country=${encodeURIComponent(country)}`);
      const data = await response.json();
      setStates(data);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchCities = async (state) => {
    try {
      const response = await fetch(`/api/fetch_country.php?type=cities&state=${encodeURIComponent(state)}`);
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "Country") {
      setFormData(prev => ({ ...prev, Country: value, State: "", City: "" }));
      if (value) fetchStates(value);
    } else if (name === "State") {
      setFormData(prev => ({ ...prev, State: value, City: "" }));
      if (value) fetchCities(value);
    }
  };

  const validateNumber = (input) => {
    const regex = /^[0-9+]*$/;
    const maxLength = 10;
    const minLength = 10;
    
    if (!regex.test(input.value)) {
      input.setCustomValidity("Please enter a valid number (digits and plus sign only).");
    } else if (input.value.length < minLength || input.value.length > maxLength) {
      input.setCustomValidity(`Please enter ${maxLength} Digit Number.`);
    } else {
      input.setCustomValidity("");
    }
  };

  const validateEmail = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value)) {
      input.setCustomValidity("Please enter a valid email address.");
    } else {
      input.setCustomValidity("");
    }
  };

  const validatePin = (input) => {
    const pinRegex = /^\d{6}$/;
    if (!pinRegex.test(input.value)) {
      input.setCustomValidity("Please enter a valid 6-digit PIN code.");
    } else {
      input.setCustomValidity("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/update_client.php?Client_id=${clientId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.status === 'success') {
        toast.success("Success", "Client Data updated successfully!");
        onSuccess();
      } else {
        toast.error("Error", result.message);
      }
    } catch (error) {
      console.error("Error updating client:", error);
      toast.error("Error", "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6" style={{ backgroundColor: themeUtils.getBgColor() }}>
      <div className="flex justify-between items-center mb-4 px-5">
        <h2 className="text-[#aa9166] text-base font-bold border-r border-[#aa9166] pr-1">
          Edit Client
        </h2>
        <Button variant="secondary" onClick={onClose}>Back</Button>
      </div>
      <hr className="border border-gray-300 my-2.5" />

      <form onSubmit={handleSubmit} className="px-5 pb-5">
        <input type="hidden" name="Client_id" value={clientId} />

        {/* Personal Details Section */}
        <div className="mb-[-8px] p-[2px_10px] rounded mr-1">
          <h2 className="text-[#aa9166] text-sm font-bold mt-1">Personal Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="mb-4">
              <label className="block mb-1 text-sm" style={{ color: themeUtils.getTextColor() }}>
                First Name
              </label>
              <input
                type="text"
                name="FirstName"
                value={formData.FirstName}
                onChange={handleChange}
                required
                className="w-full p-1 box-border rounded border text-sm"
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  color: themeUtils.getTextColor(),
                  borderColor: "#aa9166"
                }}
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1 text-sm" style={{ color: themeUtils.getTextColor() }}>
                Last Name
              </label>
              <input
                type="text"
                name="LastName"
                value={formData.LastName}
                onChange={handleChange}
                required
                className="w-full p-1 box-border rounded border text-sm"
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  color: themeUtils.getTextColor(),
                  borderColor: "#aa9166"
                }}
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1 text-sm" style={{ color: themeUtils.getTextColor() }}>
                Gender
              </label>
              <select
                name="Gender"
                value={formData.Gender}
                onChange={handleChange}
                required
                className="w-full p-2 box-border rounded border text-sm appearance-none"
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  color: themeUtils.getTextColor(),
                  borderColor: "#aa9166"
                }}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="mb-4">
              <label className="block mb-1 text-sm" style={{ color: themeUtils.getTextColor() }}>
                Birthdate
              </label>
              <input
                type="date"
                name="DateOfBirth"
                value={formData.DateOfBirth}
                onChange={handleChange}
                className="w-full p-1 box-border rounded border text-sm"
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  color: themeUtils.getTextColor(),
                  borderColor: "#aa9166"
                }}
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1 text-sm" style={{ color: themeUtils.getTextColor() }}>
                Contact
              </label>
              <input
                type="text"
                name="PhoneNo"
                value={formData.PhoneNo}
                onChange={handleChange}
                onInput={(e) => validateNumber(e.target)}
                required
                className="w-full p-1 box-border rounded border text-sm"
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  color: themeUtils.getTextColor(),
                  borderColor: "#aa9166"
                }}
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1 text-sm" style={{ color: themeUtils.getTextColor() }}>
                Email
              </label>
              <input
                type="email"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                onInput={(e) => validateEmail(e.target)}
                required
                className="w-full p-1 box-border rounded border text-sm"
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  color: themeUtils.getTextColor(),
                  borderColor: "#aa9166"
                }}
              />
            </div>
          </div>
        </div>

        <hr className="border border-gray-300 my-2.5" />

        {/* Address Details Section */}
        <div className="mb-[-8px] p-[2px_10px] rounded mr-1">
          <h2 className="text-[#aa9166] text-sm font-bold mt-1">Address Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="mb-4">
              <label className="block mb-1 text-sm" style={{ color: themeUtils.getTextColor() }}>
                Address Line 1
              </label>
              <input
                type="text"
                name="AddressLine1"
                value={formData.AddressLine1}
                onChange={handleChange}
                required
                className="w-full p-1 box-border rounded border text-sm"
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  color: themeUtils.getTextColor(),
                  borderColor: "#aa9166"
                }}
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1 text-sm" style={{ color: themeUtils.getTextColor() }}>
                Address Line 2
              </label>
              <input
                type="text"
                name="AddressLine2"
                value={formData.AddressLine2}
                onChange={handleChange}
                className="w-full p-1 box-border rounded border text-sm"
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  color: themeUtils.getTextColor(),
                  borderColor: "#aa9166"
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="mb-4">
              <label className="block mb-1 text-sm" style={{ color: themeUtils.getTextColor() }}>
                Country
              </label>
              <select
                name="Country"
                value={formData.Country}
                onChange={handleChange}
                required
                className="w-full p-2 box-border rounded border text-sm appearance-none"
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  color: themeUtils.getTextColor(),
                  borderColor: "#aa9166"
                }}
              >
                <option value={formData.Country}>{formData.Country}</option>
                {countries.map((country, index) => (
                  country !== formData.Country && (
                    <option key={index} value={country}>{country}</option>
                  )
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block mb-1 text-sm" style={{ color: themeUtils.getTextColor() }}>
                State
              </label>
              <select
                name="State"
                value={formData.State}
                onChange={handleChange}
                required
                className="w-full p-2 box-border rounded border text-sm appearance-none"
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  color: themeUtils.getTextColor(),
                  borderColor: "#aa9166"
                }}
              >
                <option value={formData.State}>{formData.State}</option>
                {states.map((state, index) => (
                  state !== formData.State && (
                    <option key={index} value={state}>{state}</option>
                  )
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block mb-1 text-sm" style={{ color: themeUtils.getTextColor() }}>
                City
              </label>
              <select
                name="City"
                value={formData.City}
                onChange={handleChange}
                required
                className="w-full p-2 box-border rounded border text-sm appearance-none"
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  color: themeUtils.getTextColor(),
                  borderColor: "#aa9166"
                }}
              >
                <option value={formData.City}>{formData.City}</option>
                {cities.map((city, index) => (
                  city !== formData.City && (
                    <option key={index} value={city}>{city}</option>
                  )
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block mb-1 text-sm" style={{ color: themeUtils.getTextColor() }}>
                Pin
              </label>
              <input
                type="text"
                name="Pin"
                value={formData.Pin}
                onChange={handleChange}
                onInput={(e) => validatePin(e.target)}
                placeholder="411017"
                required
                className="w-full p-1 box-border rounded border text-sm"
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  color: themeUtils.getTextColor(),
                  borderColor: "#aa9166"
                }}
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="grid grid-cols-1">
          <div className="text-center">
            <Button type="submit" variant="primary" loading={loading} className="mr-2">
              Save
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditClient;