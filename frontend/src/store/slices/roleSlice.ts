import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  getAllRoles, 
  getRoleById, 
  createRole, 
  updateRole, 
  deleteRole, 
  Role, 
  CreateRoleData 
} from '../../services/role.service';

interface RoleState {
  roles: Role[];
  role: Role | null;
  loading: boolean;
  error: string | null;
}

const initialState: RoleState = {
  roles: [],
  role: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchRoles = createAsyncThunk(
  'roles/fetchRoles',
  async (_, { rejectWithValue }) => {
    try {
      return await getAllRoles();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch roles');
    }
  }
);

export const fetchRoleById = createAsyncThunk(
  'roles/fetchRoleById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getRoleById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch role');
    }
  }
);

export const addRole = createAsyncThunk(
  'roles/addRole',
  async (roleData: CreateRoleData, { rejectWithValue }) => {
    try {
      return await createRole(roleData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create role');
    }
  }
);

export const modifyRole = createAsyncThunk(
  'roles/modifyRole',
  async ({ id, roleData }: { id: string; roleData: Partial<CreateRoleData> }, { rejectWithValue }) => {
    try {
      return await updateRole(id, roleData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update role');
    }
  }
);

export const removeRole = createAsyncThunk(
  'roles/removeRole',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteRole(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete role');
    }
  }
);

const roleSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    clearRoleError: (state) => {
      state.error = null;
    },
    setSelectedRole: (state, action: PayloadAction<Role | null>) => {
      state.role = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all roles
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch single role
      .addCase(fetchRoleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoleById.fulfilled, (state, action) => {
        state.loading = false;
        state.role = action.payload;
      })
      .addCase(fetchRoleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create role
      .addCase(addRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles.push(action.payload);
      })
      .addCase(addRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update role
      .addCase(modifyRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(modifyRole.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.roles.findIndex(role => role._id === action.payload._id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
        if (state.role?._id === action.payload._id) {
          state.role = action.payload;
        }
      })
      .addCase(modifyRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete role
      .addCase(removeRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = state.roles.filter(role => role._id !== action.payload);
        if (state.role?._id === action.payload) {
          state.role = null;
        }
      })
      .addCase(removeRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearRoleError, setSelectedRole } = roleSlice.actions;
export default roleSlice.reducer; 