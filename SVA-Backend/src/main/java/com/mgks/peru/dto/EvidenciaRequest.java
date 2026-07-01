package com.mgks.peru.dto;

public class EvidenciaRequest {
    private String url;
    private String obs;

    public EvidenciaRequest() {
    }

    public EvidenciaRequest(String url, String obs) {
        this.url = url;
        this.obs = obs;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getObs() {
        return obs;
    }

    public void setObs(String obs) {
        this.obs = obs;
    }
}