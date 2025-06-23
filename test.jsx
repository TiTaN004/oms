 <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned User *
              </label>
              <CustomDropdown
                name="assignedUser"
                value={formData.assignedUser}
                onChange={handleFormChange}
                options={assignedTo}
                placeholder="Select User"
                type="assignedUser"
              />
            </div>

            // old dropdown code