package com.portfolioweb.aj.Dto;

public class StaticExportResult {

    private String exportedAt;
    private String outputPath;
    private int mediaFilesWritten;
    private String message;

    public StaticExportResult() {
    }

    public StaticExportResult(String exportedAt, String outputPath, int mediaFilesWritten, String message) {
        this.exportedAt = exportedAt;
        this.outputPath = outputPath;
        this.mediaFilesWritten = mediaFilesWritten;
        this.message = message;
    }

    public String getExportedAt() {
        return exportedAt;
    }

    public void setExportedAt(String exportedAt) {
        this.exportedAt = exportedAt;
    }

    public String getOutputPath() {
        return outputPath;
    }

    public void setOutputPath(String outputPath) {
        this.outputPath = outputPath;
    }

    public int getMediaFilesWritten() {
        return mediaFilesWritten;
    }

    public void setMediaFilesWritten(int mediaFilesWritten) {
        this.mediaFilesWritten = mediaFilesWritten;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
