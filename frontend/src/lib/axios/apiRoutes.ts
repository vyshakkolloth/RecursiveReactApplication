import api from "./axios";


class apis {


    async getTree() {

        try {
            const response = await api.get("/parents");
            return response.data;
        } catch (error) {
            return error
        }
    }

    async createParent(name: string) {
        try {
            const response = await api.post("/createparentnode", { name })
            return response?.data
        } catch (error) {
            return error
        }
    }

    async createChild(name?: string, parentId?: string) {
        try {
            const response = await api.post("/childnode", { name, parentId })
            return response?.data
        } catch (error) {
            return error

        }
    }
      async EditLabel(newLabel?: string, id?: string) {
        try {
            const response = await api.patch("/editlabel", { newLabel, id })
            return response?.data
        } catch (error) {
            return error

        }
    }
        async DeleteNode( nodeId?: string) {
        try {
            const response = await api.delete(`/deletenode${nodeId}`)
            return response?.data
        } catch (error) {
            return error

        }
    }

}

export default new apis();